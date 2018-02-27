baseSuccess = require('./baseSuccess');

class templateEditUploadSuccess {
    constructor() {
        this.dependencies = ['page', 'templateEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        baseSuccess.render('templateEditUploadSuccess', 'Your template was published to the SAFE Network.');
    }

    remove() {
        baseSuccess.remove('templateEditUploadSuccess');
    }
}

module.exports = new templateEditUploadSuccess;