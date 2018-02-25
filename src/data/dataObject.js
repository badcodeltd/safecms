const file = require('./file');
const path = require('path');

class dataObject {
    constructor() {
        // Identifier must be unique & overrode by child class
        this.identifier = '';
        this.isLoaded = false;
        this.data = {};
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.save = this.save.bind(this);
        this.replaceListItemById = this.replaceListItemById.bind(this);
    }

    /**
     * @param key
     * @returns {null}
     */
    get(key) {
        return this.data.hasOwnProperty(key) ? this.data[key] : null;
    }

    /**
     * @param key
     * @param value
     */
    set(key, value) {
        this.data[key] = value;
    }

    /**
     * @throws Error
     * @param callback
     */
    load(callback) {
        let thisProxy = this;

        file.getFile('data' + path.sep + this.identifier + '.json', function(content){
            if (content === null) {
                callback(thisProxy);
                return;
            }

            thisProxy.data = JSON.parse(content);
            thisProxy.isLoaded = true;
            callback(thisProxy);
        });
    }

    /**
     * Serialize the data within this object and store it in the local filesystem
     *
     * @param callback
     * @returns {boolean}       true on success
     */
    save(callback) {
        if (typeof this.identifier !== 'string' || !this.identifier.length) {
            throw new Error('dataObject child objects must set their identifier value');
        }

        let saveData = JSON.stringify(this.data);
        file.createDirectory('data');
        file.createFile('data/' + this.identifier + '.json', JSON.stringify(this.data), callback);
    }

    /**
     * Replaces a given dataObject ilist tem by ID (if it is set) with a new dataObject list item
     *
     * @param {Array} items
     * @param {{}} newItem
     */
    replaceListItemById(items, newItem) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === newItem.id) {
                items.splice(i, 1);
            }
        }

        items.unshift(newItem);
        return items;
    }
}

module.exports = dataObject;