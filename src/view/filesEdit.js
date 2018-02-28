const random = require('../util/random');
const file = require('../data/file');
const path = require('path');

class filesEdit {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
        this.safeDraftPost = this.safeDraftPost.bind(this);
    }

    render() {
        let files = window.state.activeFile,
            filesDomain = !files || !files.networkPath ? false : files.networkPath,
            domainOptionsHTML = '',
            editable = !files || !files.path || !files.path.length,
            absoluteFileUrl = '';

        window.state.activeFile = false;

        for (let i = 0; i < window.state.cachedDomains.length; i++) {
            let d = window.state.cachedDomains[i];

            for (let s = 0; s < d.services.length; s++) {
                let networkPath = `_public/` + d.name + `/root-` + d.services[s].name + `/`;

                if (files && files.slug && files.networkPath === networkPath) {
                    absoluteFileUrl = `safe://` + d.services[s].name + `.` + d.name + `/` + files.slug;
                }

                domainOptionsHTML += `<option value="` + networkPath + `" ` + (networkPath === filesDomain ? "selected" : '') + `>safe://` + d.services[s].name + `.` + d.name + `</option>`;
            }
        }

        window.jquery('.page .content').html(
            `<div class="post-edit file-edit">
                <div class="post-content">
                    <form action="" method="POST">
                        <div><label>File Title</label></div>
                        ` + (!editable ? `<div class="form-value">` + files.title + `</div><div class="hidden-form-element">` : '') + `
                            <input type="text" id="file-title" name="title" placeholder="File title" value="` + (files ? files.title : '') + `" />
                        ` + (!editable ? `</div><div class="hidden-form-element">` : '') + `
                        <div><label>File Domain</label></div>
                        <select name="file-domain">` + (domainOptionsHTML.length ? domainOptionsHTML : `<option disabled>Please create a domain and service on the Domains page</option>`) + `</select>
                        ` + (!editable ? `</div>` : '') + `
                        <div><label>File URL</label></div>
                        ` + (!editable ? `<div class="form-value">` + absoluteFileUrl + `</div><div class="hidden-form-element">` : '') + `
                        <input class="slug active" type="text" id="file-slug" name="slug" placeholder="File URL" value="` + (files ? files.slug : '') + `" />
                        ` + (!editable ? `</div>` : ``) + `
                        <div><label>File</label></div>
                        ` + (!editable ? `<div class="file-upload-path">` + files.path + `</div>` : `<input type="file" name="file-path" />`) + `
                    </form>
                </div>
                <div class="post-meta">
                    <div class="post-controls">
                        <div class="button green publish">Publish to SafeNet</div>
                    </div>
                </div>
            </div>`
        );

        let tempThis = this;
        window.jquery('.post-edit .post-controls .publish').on('click', function() {
            tempThis.safeDraftPost(files, function() {
                files = window.state.activeFile;

                if (!files.slug || !files.slug.length) {
                    alert('Please add a valid file URL before attempting to publish');
                    return;
                }

                window.jquery('#container .post-edit').append(`
                    <div class="post-edit-loading">
                        <div class="post-edit-loading-inner">Uploading file to SAFE Network</div>
                    </div>
                `);

                window.safe.uploadFile(files.path, files.networkPath + files.slug)
                    .then(result => {
                        window.controller.renderView('filesEditSuccess')
                    });
            });
        });
    }

    remove() {
        window.jquery('.post-edit .slug-trigger').off('click');
        window.jquery('.post-edit .post-controls .publish').off('click');
        window.jquery('.page .content').remove('.post-edit');
    }

    safeDraftPost(files, callback) {
        if (!files) {
            files = {
                id: random.getRandomString(16)
            }
        }

        files.title = window.jquery('.post-edit #file-title').val();
        files.slug = window.jquery('.post-edit #file-slug').val();
        files.path = files.path && files.path.length ? files.path : document.getElementsByName('file-path')[0].files[0].path;
        files.networkPath = window.jquery('.post-edit select[name="file-domain"]').val();

        let dateOptions = {weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"};
        files.lastModified = (new Date).toLocaleDateString('en-us', dateOptions);

        let currentFiles = window.state.files.get('list');

        for (let i = 0; i < currentFiles.length; i++) {
            if (currentFiles[i].id === files.id) {
                currentFiles.splice(i, 1);
            }
        }

        currentFiles.unshift(files);

        window.state.files.set('list', currentFiles);
        window.state.activeFile = files;

        file.createDirectory('posts');
        window.state.files.save(callback);
    }
}

module.exports = new filesEdit;