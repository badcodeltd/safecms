class view {
    constructor() {
        // Dependencies must be valid views which have been loaded by the controller
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').html(
            `<div class="example-container">Rendered some content</div>`
        );

        // Attach events here
    }

    remove() {
        // Remove events here

        window.jquery('#container').remove('.example-container');
    }
}

module.exports = new view;