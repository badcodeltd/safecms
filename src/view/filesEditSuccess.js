baseSuccess = require('./baseSuccess');

class filesEditSuccess {
    constructor() {
        this.dependencies = ['page', 'filesEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        baseSuccess.render('filesEditSuccessTimeout', 'Your file was published to the SAFE network.');
    }

    remove() {
        baseSuccess.remove('filesEditSuccessTimeout');
    }
}

module.exports = new filesEditSuccess;