const dataObject = require('./dataObject');

class dateObjectName extends dataObject {
    constructor() {
        super();
        this.identifier = 'dateObjectName';

        // If you intend to treat this object as an (unordered) array, then the next line is required, else remove it
        this.set('list', []);
    }
}

module.exports = new dateObjectName;

// Loading, you should store a global reference as `require` will supply a new (empty) object every time

window.data = require('dataObjectName');

data.load(function(){
    // Callback function in here
});

// Usage as an array:

data.get('list').push({someData: 'some value'});

// Usage as a raw dataObject

data.set('key', 'value');

// Saving:

data.save(function(){
    // Callback function in here
});