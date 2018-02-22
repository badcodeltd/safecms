class settingsListSuccess {
    constructor() {
        this.dependencies = ['page', 'settingsList'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').append(`<div class="post-edit-success">Your settings have been saved.</div>`);

        window.state.postEditSuccessTimeout = setTimeout(function(){
            window.jquery('#container').find('.post-edit-success').remove();
        }, 3000);
    }

    remove() {
        clearTimeout(window.state.postEditSuccessTimeout);
        window.jquery('#container').find('.post-edit-success').remove();
    }
}

module.exports = new settingsListSuccess;