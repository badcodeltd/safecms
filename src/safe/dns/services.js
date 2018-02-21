/**
 * Create service folder within _public container
 * - Create random public mutable data and insert it under _public container
 * - This entry will have the servicePath as its key
 * - This Mutable Data will hold the list file stored under it and
 * the files full paths will be stored as the key to maintain a plain structure.
 * @param {SafeApi} SafeApi
 * @param {string} servicePath - service path on network (EG: "_public/${publicName}/${serviceName}"
 */
async function createServiceFolder(SafeApi, servicePath) {
    if (!servicePath) {
        throw 'Invalid service path: ' + servicePath;
    }

    const directory = servicePath.replace('_public/', '');

    if (!directory) {
        throw 'Invalid service directory metadata: ' + directory;
    }
    const metaName = 'Service Root Directory for: ' + directory;
    const metaDesc = 'Has the files hosted for the service: ' + directory;

    // 15002 is the TYPE_TAG for WWW MData objects
    const servFolder = await SafeApi.app.mutableData.newRandomPublic(15002);
    await servFolder.quickSetup({}, metaName, metaDesc);
    const servFolderInfo = await servFolder.getNameAndTag();
    const pubCntr = await SafeApi.getContainer('_public');

    try {
        await SafeApi.insertToMutableData(pubCntr, servicePath, servFolderInfo.name);
        return servFolderInfo.name;
    } catch (err) {
        return false;
    }
}

/**
 * Create new service
 * - Insert an entry into the service container with
 * key as sericeName and value as pathXORName
 * - If serviceName was created and deleted before,
 * it leaves the entry with empty buffer as its value.
 * Update the entry with the pathXORName as its value.
 * @param {SafeApi} SafeApi
 * @param {string} publicName the public name
 * @param {string} serviceName the service name
 * @param {Buffer} pathXORName XORName of service Mutable Data
 */
async function createService(SafeApi, publicName, serviceName, pathXORName) {
    let servCntr;

    try {
        const pubNamesCntr = await SafeApi.getContainer('_publicNames');
        const servCntrName = await SafeApi.getMDataValueForKey(pubNamesCntr, publicName);
        servCntr = await this.getServicesContainer(SafeApi, servCntrName);
        await SafeApi.insertToMutableData(servCntr, serviceName, pathXORName, false);
        return true;
    } catch (err) {
        if (err.code !== -107) {
            return false;
        }

        try {
            await SafeApi.updateMutableData(servCntr, serviceName, pathXORName, true);
            return true;
        } catch (e) {
            return false;
        }
    }
}

/**
 * Get list name of service folder stored under _public container
 *
 * @param {SafeApi} SafeApi
 * @return {[*]}
 */
async function getServiceFolderNames(SafeApi) {
    const serviceFolderList = [];
    const pubCntr = await SafeApi.getContainer('_public');
    const serviceFolders = await pubCntr.getKeys();

    if (serviceFolders.length !== 0) {
        await serviceFolders.forEach((key) => {
            if (!key) {
                return;
            }
            serviceFolderList.unshift(key.toString());
        });
    }

    return serviceFolderList;
}

/**
 * Fetch services registered under all the Public Names
 *
 * @return {Promise<[*]>} array of Public Names with services
 */
async function getServices(SafeApi) {
    if (window.state.cachedDomains.length) {
        return window.state.cachedDomains;
    }

    const publicNames = await SafeApi.getPublicNames();
    const updatedPubNames = [];

    const updateServicePath = (service) => (
        new Promise(async (resolve, reject) => {
            try {
                const path = await this.getServicePath(SafeApi, service.xorname);
                resolve({
                    name: service.name,
                    path
                });
            } catch (err) {
                reject(err);
            }
        })
    );

    const fetch = (pubName) => {
        const serviceList = [];
        return new Promise(async (resolve, reject) => {
            try {
                const pubNamesCntr = await SafeApi.getContainer('_publicNames');
                const servCntrName = await SafeApi.getMDataValueForKey(pubNamesCntr, pubName);
                const servCntr = await SafeApi.getServicesContainer(servCntrName);
                const services = await servCntr.getEntries();

                await services.forEach((key, value) => {
                    const service = key.toString();
                    if ((service.indexOf('@') !== -1) || (value.buf.length === 0) || service === '_metadata') {
                        return;
                    }
                    serviceList.push({name: service, xorname: value.buf});
                });

                const servicesQ = [];
                for (const service of serviceList) {
                    servicesQ.push(updateServicePath(service));
                }

                let tempList = await Promise.all(servicesQ);
                updatedPubNames.push({name: pubName, services: tempList.sort(this.sortAlphabeticallyByName)});
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    };

    return new Promise(async (resolve, reject) => {
        try {
            const publicNameQ = [];
            for (const pubName of publicNames) {
                publicNameQ.push(fetch(pubName.name));
            }
            await Promise.all(publicNameQ);
            resolve(updatedPubNames.slice(0).sort(this.sortAlphabeticallyByName));
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Returns a public mutable data container with the TYPE_TAG metadata set to DNS
 *
 * @param {SafeApi} SafeApi
 * @param publicContainerName
 * @returns {Promise<MutableData>}
 */
async function getServicesContainer(SafeApi, publicContainerName) {
    // 15001 is the TYPE_TAG for DNS
    return SafeApi.app.mutableData.newPublic(publicContainerName, 15001);
}

/**
 * @param SafeApi
 * @param serviceXorName
 * @returns {Promise<any>}
 */
function getServicePath(SafeApi, serviceXorName) {
    let servicePath = null;
    return new Promise(async (resolve, reject) => {
        try {
            const publicMd = await SafeApi.getContainer('_public');
            const entries = await publicMd.getEntries();
            await entries.forEach((key, val) => {
                if (val.buf.equals(serviceXorName)) {
                    servicePath = key.toString();
                }
            });
            resolve(servicePath);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * For use with array.sort()
 *
 * @param a
 * @param b
 * @returns {number}
 */
function sortAlphabeticallyByName(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

module.exports = {
    createServiceFolder: createServiceFolder,
    createService: createService,
    getServices: getServices,
    getServiceFolderNames: getServiceFolderNames,
    getServicesContainer: getServicesContainer,
    getServicePath: getServicePath,
    sortAlphabeticallyByName: sortAlphabeticallyByName
};