class filesEditSuccess {
    constructor() {
        this.dependencies = ['page', 'filesEdit'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').append(`<div class="post-edit-success">Your file was published to the SAFE network.</div>`);

        window.state.filesEditSuccessTimeout = setTimeout(function(){
            window.jquery('#container').find('.post-edit-success').remove();
        }, 3000);
    }

    remove() {
        clearTimeout(window.state.filesEditSuccessTimeout);
        window.jquery('#container').find('.post-edit-success').remove();
    }
}

module.exports = new filesEditSuccess;