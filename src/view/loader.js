class loader {
    constructor() {
        this.dependencies = [];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').html(
            `<div class="loader-container">
                <div class="loader">
                    <div class="loading-circle"></div>
                    <div class="loading-circle"></div>
                    <div class="loading-circle"></div>
                    <div class="loading-circle"></div>
                    <div class="title">Opening the SAFE authenticator</div>
                </div>
            </div>`
        );

        window.safe.initialize(function(safeApp){
            window.controller.renderView(safeApp.app.isNetStateConnected() ? 'domainList' : 'loaderError');
        });
    }

    remove() {
        window.jquery('#container').remove('.loader-container');
    }
}

module.exports = new loader;