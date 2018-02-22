class Page {
    constructor() {
        this.dependencies = [];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').html(
            `<div class="page">
                <div class="sidebar">
                    <div class="logo">
                        <img src="./src/css/img/logo.png" alt="Safe-CMS logo" />
                    </div>
                    <div class="item" data-render="domainList">Domains</div>
                    <div class="item" data-render="postList">Posts</div>
                    <div class="item" data-render="templateList">Templates</div>
                    <div class="item" data-render="settingsList">Settings</div>
                </div>
                <div class="contentContainer">
                    <div class="content"></div>
                </div>
            </div>`
        );

        window.jquery('.page .sidebar .item').on('click', function(){
            window.controller.renderView(window.jquery(this).data('render'));
        });
    }

    remove() {
        window.jquery('.page .sidebar .item').off('click');
        window.jquery('#container').remove('.page');
    }
}

module.exports = new Page;