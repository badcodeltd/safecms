dataObject = require('./dataObject');

class domains extends dataObject {
    constructor() {
        super();
        this.identifier = 'domains';
        this.set('list', []);
    }
}

module.exports = new domains;