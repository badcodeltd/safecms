/**
 * Create new Public Name
 * - Create new Public Mutable Data with sha3hash of publicName as its XORName
 * - Create new entry with publicName as key and XORName as its value
 * - Insert this entry within the _publicNames container
 * @param {SafeApi} SafeApi     An authenticated instance of SafeApi
 * @param {string}  publicName  The public name you want to register
 * @throws Error
 * @returns SafeApi
 */
async function createPublicName(SafeApi, publicName) {
    if (typeof publicName !== "string") {
        throw new Error("A public name must be a string, " + (typeof publicName) + " was passed to SafeApi.createPublicName");
    }

    const name = publicName.trim();

    if (!publicName.length) {
        throw new Error("Public names must be at least 1 character in length");
    }

    const metaName = `Services container for: ${name}`;
    const metaDesc = `Container where all the services are mapped for the Public Name: ${name}`;
    const hashedName = await SafeApi.app.crypto.sha3Hash(publicName);
    const serviceContainer = await SafeApi.getServicesContainer(hashedName);

    try {
        // This call writes the public name to the network
        await serviceContainer.quickSetup({}, metaName, metaDesc);
        const pubNamesCntr = await SafeApi.getContainer('_publicNames');
        return await SafeApi.insertToMutableData(pubNamesCntr, name, hashedName, true);
    } catch (err) {
        console.log(err);
        console.log("The network rejected your publicName, this is normally because the name already exists");
        return false;
    }
}

/**
 * get Public Names under _publicNames container
 *
 * @param SafeApi
 * @returns {Promise<*>}    array of Public Names
 */
async function getPublicNames(SafeApi) {
    const publicNames = [];

    const decryptPublicName = (pubNamesCntr, encPubName) => (
        new Promise(async (resolve, reject) => {
            try {
                const decPubNameBuf = await pubNamesCntr.decrypt(encPubName);
                const decPubName = decPubNameBuf.toString();

                // Metadata keys should be ignored
                if (decPubName !== '_metadata') {
                    publicNames.push({
                        name: decPubName
                    });
                }

                resolve(true);
            } catch (err) {
                if (err.code === -3) {
                    return resolve(true);
                }
                reject(err);
            }
        })
    );

    try {
        const pubNamesCntr = await SafeApi.getContainer('_publicNames');
        const encPubNames = await pubNamesCntr.getKeys();
        if (encPubNames.length === 0) {
            return [];
        }

        const decryptPubNamesQ = [];
        for (const encPubName of encPubNames) {
            decryptPubNamesQ.push(decryptPublicName(pubNamesCntr, encPubName));
        }

        await Promise.all(decryptPubNamesQ);
        return publicNames.slice(0);
    } catch (err) {
        return [];
    }
}

module.exports = {
    'createPublicName': createPublicName,
    'getPublicNames': getPublicNames
};