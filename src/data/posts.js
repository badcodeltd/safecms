dataObject = require('./dataObject');

class posts extends dataObject {
    constructor() {
        super();
        this.identifier = 'posts';
        this.set('list', []);
    }
}

module.exports = new posts;