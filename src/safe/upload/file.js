const fs = require('fs');
const path = require('path');

class file  {
    constructor() {
        this.save = this.save.bind(this);
        this.parseNetworkPath = this.parseNetworkPath.bind(this);
    }

    /**
     * @param api
     * @param localPath
     * @param networkPath
     * @returns {Promise<*>}
     */
    save(api, localPath, networkPath) {
        const containerPath = this.parseNetworkPath(networkPath);
        const fileStats = fs.statSync(localPath);
        const fd = fs.openSync(localPath, 'r');
        const { size } = fileStats;

        let offset = 0,
            buffer = null,
            chunkSize = 1000000;

        const writeFile = (file, remainingBytes) => (
            new Promise(async (resolve, reject) => {
                try {
                    if (remainingBytes < chunkSize) {
                        chunkSize = remainingBytes;
                    }

                    buffer = Buffer.alloc(chunkSize);
                    fs.readSync(fd, buffer, 0, chunkSize, offset);
                    await file.write(buffer);
                    offset += chunkSize;
                    remainingBytes -= chunkSize;

                    if (offset === size) {
                        await file.close();
                        return resolve(file);
                    }

                    await writeFile(file, remainingBytes);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
        );

        return new Promise(async (resolve, reject) => {
            try {
                const pubCntr = await api.getContainer('_public');
                const servFolderName = await api.getMDataValueForKey(pubCntr, containerPath.dir);
                const servFolder = await api.app.mutableData.newPublic(servFolderName, 15002);
                const nfs = servFolder.emulateAs('NFS');
                const file = await nfs.open();
                await writeFile(file, size);

                try {
                    await nfs.insert(containerPath.file, file);
                } catch (e) {
                    if (e.code !== -107) {
                        reject(e);
                    }
                    const fileXorname = await servFolder.get(containerPath.file);
                    await nfs.update(containerPath.file, file, fileXorname.version + 1);
                }

                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * @param nwPath
     * @returns {{dir: undefined, file: undefined}}
     */
    parseNetworkPath(nwPath) {
        const result = {
            dir: undefined,
            file: undefined,
        };

        if (nwPath) {
            const splitPath = nwPath.split('/');
            result.dir = splitPath.slice(0, splitPath.length - 1).join('/');
            result.file = splitPath[splitPath.length - 1] || path.basename(nwPath);
        }

        return result;
    };
}

module.exports = new file;