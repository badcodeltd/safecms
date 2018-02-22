const fs = require('fs');
const path = require('path');

/**
 * All paths accepted and returned by this class are relative to the App's safe-cms folder for normalisation
 * with the exception of the getPath function
 */
class file {
    constructor() {
        this.basePath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local');
        this.basePath = this.basePath + path.sep + 'safe-cms';

        // Only triggers the create if the path doesn't exist, just guarantees our settings directory is there.
        this.createDirectory(false);

        this.pathExists = this.pathExists.bind(this);
        this.getDirectory = this.getDirectory.bind(this);
        this.createDirectory = this.createDirectory.bind(this);
        this.getFile = this.getFile.bind(this);
        this.createFile = this.createFile.bind(this);
    }

    /**
     * Takes a relativePath and returns an absolute path
     * There is no gaurantee that the path returned is valid, this is a convenience function
     *
     * @param relativePath
     * @returns string
     */
    getPath(relativePath) {
        return relativePath ? this.basePath + path.sep + relativePath : this.basePath;
    }

    /**
     * Sync
     *
     * @param relativePath
     * @returns boolean
     */
    pathExists(relativePath) {
        let absolutePath = this.getPath(relativePath);
        return fs.existsSync(absolutePath);
    }

    /**
     * Sync
     * Returns a list of child path nodes relative to the safe-cms folder
     * As a result, all the paths returned are valid for use with any method of this class
     *
     * @param relativePath
     * @returns {Array}
     */
    getDirectory(relativePath) {
        let elements = [],
            dirPath = this.getPath(relativePath);

        if (!this.pathExists(dirPath)) {
            return elements;
        }

        fs.readdir(dirPath, function(err, items) {
            for (let i = 0; i < items.length; i++) {
                elements.push(relativePath + path.sep + items[i])
            }
        });

        return elements;
    }

    /**
     * Sync
     * Create a directory if it does not already exist
     *
     * @param relativePath
     * @returns boolean
     */
    createDirectory(relativePath) {
        if (this.pathExists(relativePath)) {
            return false;
        }

        let absolutePath = this.getPath(relativePath);
        fs.mkdirSync(absolutePath);
        return true;
    }

    /**
     * Async
     *
     * @param relativePath
     * @param callback
     */
    getFile(relativePath, callback) {
        fs.readFile(this.getPath(relativePath), function read(err, content) {
            if (err) {
                callback(null);
                return;
            }

            callback(content);
        });
    }

    /**
     * Async
     * This function will fail if the directory you are trying to write the file in does not yet exist
     *
     * @param relativePath
     * @param content
     * @param callback
     * @returns {boolean}       true on success
     */
    createFile(relativePath, content, callback) {
        fs.writeFile(this.getPath(relativePath), content, function(err) {
            callback(!err);
        });
    }
}

module.exports = new file;