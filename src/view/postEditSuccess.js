baseSuccess = require('./baseSuccess');

class postEditSuccess {
    constructor() {
        this.dependencies = ['page', 'postEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        baseSuccess.render('postEditSuccessTimeout', 'Your draft post was saved locally.');
    }

    remove() {
        baseSuccess.remove('postEditSuccessTimeout');
    }
}

module.exports = new postEditSuccess;