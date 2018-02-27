baseSuccess = require('./baseSuccess');

class templateEditSuccess {
    constructor() {
        this.dependencies = ['page', 'templateEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        baseSuccess.render('templateEditSuccessTimeout', 'Your draft template was saved locally');
    }

    remove() {
        baseSuccess.remove('templateEditSuccessTimeout');
    }
}

module.exports = new templateEditSuccess;