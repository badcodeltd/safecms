dataObject = require('./dataObject');

class files extends dataObject {
    constructor() {
        super();
        this.identifier = 'files';
        this.set('list', []);
    }
}

module.exports = new files;