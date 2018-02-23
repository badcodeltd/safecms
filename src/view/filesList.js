class filesList {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        let filesListHtml = '';

        window.state.files.get('list').map(function(files) {
            let pathLength = files.path.length - 40;
            filesListHtml += `<div class="item" data-id="` + files.id + `">
                <div class="info">` + files.title + `</div>
                <div class="info">` + (files.path.length > 40 ? `&hellip;` : '') + files.path.substr(Math.max(pathLength, 0)) + `</div>
            </div>`
        });

        window.jquery('.page .content').html(
            `<div class="post-list file-list">
                <div class="post-headings">
                    <div class="heading">Name</div>
                    <div class="heading">Local path</div>
                </div>
                <div class="posts">
                    ` + (filesListHtml.length ? filesListHtml : `<div class="empty">No files</div>`) + `
                </div>
            </div>
            <div class="post-actions">
                <div class="button">Create file</div>
            </div>`
        );

        window.jquery('.post-list .posts .item').on('click', function(){
            let id = window.jquery(this).data('id'),
                files = window.state.files.get('list');

            for (let i = 0; i < files.length; i++) {
                if (files[i].id === id) {
                    window.state.activeFile = files[i];
                }
            }

            if (window.state.activeFile) {
                window.controller.renderView('filesEdit');
            } else {
                alert('There was an error loading this file, please restart the app and try again');
            }
        });

        window.jquery('.post-actions .button').on('click', function(){
            window.state.activeFile = false;
            window.controller.renderView('filesEdit')
        });
    }

    remove() {
        window.jquery('.post-actions .button').off('click');
        window.jquery('.post-list .posts .item').off('click');
        window.jquery('.page .content').remove('.post-list');
    }
}

module.exports = new filesList;