baseSuccess = require('./baseSuccess');

class settingsListSuccess {
    constructor() {
        this.dependencies = ['page', 'settingsList'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        baseSuccess.render('settingsListSuccessTimeout', 'Your settings have been saved.');
    }

    remove() {
        baseSuccess.remove('settingsListSuccessTimeout');
    }
}

module.exports = new settingsListSuccess;