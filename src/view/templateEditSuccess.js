class templateEditSuccess {
    constructor() {
        this.dependencies = ['page', 'templateEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').append(`<div class="post-edit-success">Your draft post was saved locally.</div>`);

        window.state.postEditSuccessTimeout = setTimeout(function(){
            window.jquery('#container').find('.post-edit-success').remove();
        }, 3000);
    }

    remove() {
        clearTimeout(window.state.postEditSuccessTimeout);
        window.jquery('#container').find('.post-edit-success').remove();
    }
}

module.exports = new templateEditSuccess;