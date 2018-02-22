dataObject = require('./dataObject');

class settings extends dataObject {
    constructor() {
        super();
        this.identifier = 'settings';
    }
}

module.exports = new settings;