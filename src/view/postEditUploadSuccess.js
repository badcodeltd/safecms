baseSuccess = require('./baseSuccess');

class postEditUploadSuccess {
    constructor() {
        this.dependencies = ['page', 'postEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        baseSuccess.render('postEditUploadSuccess', 'Your post was published to the SAFE Network.');

    }

    remove() {
        baseSuccess.remove('postEditUploadSuccess');
    }
}

module.exports = new postEditUploadSuccess;