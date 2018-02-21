/**
 * Add a key / value pair to the given mutable data
 *
 * @param mutableData
 * @param key
 * @param val
 * @param {bool} encrypt
 * @returns {Promise<*>}
 */
function insertTo(mutableData, key, val, encrypt) {
    let keyToInsert = key;
    let valToInsert = val;

    return new Promise(async (resolve, reject) => {
        try {
            const entries = await mutableData.getEntries();
            const mut = await entries.mutate();

            if (encrypt) {
                keyToInsert = await mutableData.encryptKey(key);
                valToInsert = await mutableData.encryptValue(val);
            }

            await mut.insert(keyToInsert, valToInsert);
            await mutableData.applyEntriesMutation(mut);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 *
 * @param md
 * @param key
 * @param value
 * @param ifEmpty
 * @returns {Promise<any>}
 */
function update(md, key, value, ifEmpty) {
    return new Promise(async (resolve, reject) => {
        try {
            const entries = await md.getEntries();
            const val = await entries.get(key);

            if (ifEmpty && val.buf.length !== 0) {
                return reject('Entry value is not empty');
            }

            const mut = await entries.mutate();
            await mut.update(key, value, val.version + 1);
            await md.applyEntriesMutation(mut);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * @param md
 * @param key
 * @returns {Promise<*>}
 */
function getMDataValueForKey(md, key) {
    return new Promise(async (resolve, reject) => {
        try {
            const encKey = await md.encryptKey(key);
            const value = await md.get(encKey);
            const result = await md.decrypt(value.buf);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    insertTo: insertTo,
    update: update,
    getMDataValueForKey: getMDataValueForKey
};