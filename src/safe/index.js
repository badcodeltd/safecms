const safe = require('@maidsafe/safe-node-app');
const authApi = require('./auth/auth');
const publicNameApi = require('./dns/publicName');
const serviceApi = require('./dns/services');
const fileUploader = require('./upload/file');
const mutableDataApi = require('./data/mutable');
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const isDevMode = process.execPath.match(/[\\/]electron/);
const electronApp = remote.app;

class SafeApi {
    constructor() {
        this.app = false;
    }

    // The following methods deal with authentication

    /**
     * If the command was run with NODE_ENV dev, this will provide us with a mock login, else it will attempt a safe-auth login
     * A limitation of auth.loginForTest is that the permissions only persist until this process completes, running another process will
     * result in a new object which doesn't have permissions to the containers / MData created
     *
     * @param {function} callback       The function to call when the IPC response is received from the main thread process
     * @returns {Promise<*>}
     */
    async initialize(callback) {
        const appInfo = {
            id: 'net.safecms.app', name: 'SafeCMS', vendor: 'Shane Armstrong',
            customExecPath: isDevMode ? [`${process.execPath}`, `${electronApp.getAppPath()}`] : [electronApp.getPath('exe')]
        };

        if (isDevMode && process.platform === 'darwin') {
            appInfo.bundle = 'com.github.electron';
        }

        const containers = {
            _public: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions'],
            _publicNames: ['Read', 'Insert', 'Update', 'Delete', 'ManagePermissions']
        };
        this.app = await safe.initializeApp(appInfo);

        if (typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV.startsWith("dev")) {
            await this.app.auth.loginForTest(containers);
            callback(this);
        }

        let uri = await this.app.auth.genAuthUri(containers);
        await this.app.auth.openUri(uri);

        let thisProxy = this;

        // persists the app object and send the API interface to the callback supplied above
        async function listenForAuthResponse(event, response) {
            thisProxy.app = await safe.fromAuthURI(appInfo, response);
            callback(thisProxy);
        }

        // IPC response handler is unset once used
        ipcRenderer.once('auth-response', listenForAuthResponse);
    }

    // The following methods deal with containers and "DNS" entries in the _publicNames scope

    /**
     * Get a local container mutable data, for example "_publicNames" or "_pictures"
     *
     * @param key
     * @returns {Promise<*>}
     */
    async getContainer(key) {
        return await authApi.getContainer(this, key);
    }

    /**
     * Create new Public Name
     * - Create new Public Mutable Data with sha3hash of publicName as its XORName
     * - Create new entry with publicName as key and XORName as its value
     * - Insert this entry within the _publicNames container
     * @param {string} publicName the public name
     * @throws Error
     * @returns return new Promise(resolve => {
     */
    async createPublicName(publicName) {
        return await publicNameApi.createPublicName(this, publicName)
    }

    /**
     * Fetch Public Names in the _publicNames container
     *
     * @returns {Promise<*>}    array of Public Names
     */
    async getPublicNames() {
        return await publicNameApi.getPublicNames(this)
    }

    // The following methods deal with services within containers

    /**
     * Returns a public mutable data container with the TYPE_TAG metadata set to DNS
     *
     * @param publicContainerName
     * @returns {Promise<*>}
     */
    async getServicesContainer(publicContainerName) {
        return await serviceApi.getServicesContainer(this, publicContainerName);
    }

    /**
     * Create service folder within _public container
     * - Create random public mutable data and insert it under _public container
     * - This entry will have the servicePath as its key
     * - This Mutable Data will hold the list file stored under it and
     *   the files full paths will be stored as the key to maintain a plain structure.
     *
     * @param {string} networkPath - Network service path on network (EG: "${publicName}/${serviceName}"
     *  if the path is "_public/example/www", networkPath would be "example/www"
     */
    async createServiceFolder(networkPath) {
        return await serviceApi.createServiceFolder(this, "_public/" + networkPath);
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
    async createService(publicName, serviceName, pathXORName) {
        return await serviceApi.createService(this, publicName, serviceName, pathXORName);
    }

    /**
     * Fetch services registered unders all the Public Names
     *
     * @return {Promise<[*]>} array of Public Names with services
     */
    async getServices() {
        return await serviceApi.getServices(this);
    }

    /**
     * Get list name of service folder stored under _public container
     *
     * @param {SafeApi} SafeApi
     * @return {[*]}
     */
    async getServiceFolderNames() {
        return await serviceApi.getServiceFolderNames(this);
    }

    /**
     *
     * @param {string} localPath
     * @param {string} networkPath - Network service path on network (EG: "${serviceName}.${publicName}/path.to/file"
     *  if the path is "_public/www.example/path/to/file", networkPath would be "www.example/path/to/file"
     *
     * @returns {Promise<*>}
     */
    async uploadFile(localPath, networkPath) {
        return await fileUploader.save(this, localPath, networkPath);
    }

    /**
     * Add a key / value pair to the given mutable data
     *
     * @param mutableData
     * @param key
     * @param value
     * @param {boolean} encrypt
     * @returns {Promise<*>}
     */
    async insertToMutableData(mutableData, key, value, encrypt) {
        return await mutableDataApi.insertTo(mutableData, key, value, encrypt);
    }

    /**
     * @param md
     * @param key
     * @param value
     * @param ifEmpty
     * @returns {Promise<*>}
     */
    async updateMutableData(md, key, value, ifEmpty) {
        return await mutableDataApi.update(md, key, value, ifEmpty);
    }

    /**
     * @param md
     * @param key
     * @returns {Promise<*>}
     */
    async getMDataValueForKey(md, key) {
        return await mutableDataApi.getMDataValueForKey(md, key);
    }
}

module.exports = new SafeApi;