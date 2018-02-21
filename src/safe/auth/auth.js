/**
 * Get a local container mutable data, for example "_public" or "_pictures"
 *
 * @param SafeApi
 * @param key
 * @returns {Promise<MutableData>}
 */
async function getContainer(SafeApi, key) {
    return SafeApi.app.auth.getContainer(key);
}

module.exports = {
    getContainer: getContainer
};