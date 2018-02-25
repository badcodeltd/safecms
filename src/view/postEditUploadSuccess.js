class postEditUploadSuccess {
    constructor() {
        this.dependencies = ['page', 'postEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').append(`<div class="post-edit-success">Your post was published to the SAFE Network.</div>`);

        window.state.postEditSuccessTimeout = setTimeout(function(){
            window.jquery('#container').find('.post-edit-success').remove();
        }, 3000);
    }

    remove() {
        clearTimeout(window.state.postEditSuccessTimeout);
        window.jquery('#container').find('.post-edit-success').remove();
    }
}

module.exports = new postEditUploadSuccess;