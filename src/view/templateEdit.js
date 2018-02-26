const random = require('../util/random');
const file = require('../data/file');
const path = require('path');
const templateRenderer = require('../util/template');

class templateEdit {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
        this.saveDraftTemplate = this.saveDraftTemplate.bind(this);
    }

    render() {
        let template = window.state.activeTemplate,
            templateStatusText = !template || template.status === 0 ? 'draft' : (template.status === 1 ? 'published' : 'edited'),
            templateDomain = !template || !template.networkPath ? false : template.networkPath,
            domainOptionsHTML = '';

        window.state.activeTemplate = false;

        for (let i = 0; i < window.state.cachedDomains.length; i++) {
            let d = window.state.cachedDomains[i];

            for (let s = 0; s < d.services.length; s++) {
                let networkPath = `_public/` + d.name + `/root-` + d.services[s].name + `/`;
                domainOptionsHTML += `<option value="` + networkPath + `" ` + (networkPath === templateDomain ? "selected" : '') + `>safe://` + d.services[s].name + `.` + d.name + `</option>`;
            }
        }

        window.jquery('.page .content').html(
            `<div class="post-edit">
                <div class="post-content">
                    <form action="" method="POST">
                        <div><label>Template Title</label></div>
                        <input type="text" id="post-title" name="title" placeholder="Post title" value="` + (template ? template.title : '') + `" />
                        <div><label>Template Domain</label></div>
                        <select name="post-domain">` + (domainOptionsHTML.length ? domainOptionsHTML : '<option disabled>Please create a domain and service on the Domains page</option>') + `</select>
                        <div><label>CSS</label></div>
                        <div class="editor-container"><div class="editor-instance" id="editor-css"></div></div>
                        <div><label>HTML before content</label></div>
                        <div class="editor-explanation">Your application must export a container with the class "content" to display the "Built with Safe CMS" advert.</div>
                        <div class="editor-container"><div class="editor-instance" id="editor-before"></div></div>
                        <div><label>HTML after content</label></div>
                        <div class="editor-container"><div class="editor-instance" id="editor-after"></div></div>
                        <div><label>Javascript</label></div>
                        <div class="editor-container"><div class="editor-instance" id="editor-js"></div></div>
                    </form>
                </div>
                <div class="post-meta">
                    <div class="post-meta-indicator">
                        <div class="indicator-bar-background"></div>
                        <div class="indicator-bar ` + templateStatusText.toLocaleLowerCase() + `"></div>
                        <div class="indicator-item active">Draft</div>
                        <div class="indicator-item ` + (template && template.status > 0 ? 'active' : '') + `">Published</div>
                        <div class="indicator-item ` + (template && template.status > 1 ? 'active' : '') + `">Edited</div>
                    </div>
                    <div class="post-controls">
                        <div class="button preview">Preview</div>
                        <div class="button save-draft">Save draft</div>
                        <div class="button green publish">Publish to SafeNet</div>
                    </div>
                </div>
            </div>`
        );

        let tempThis = this;
        window.jquery('.post-edit .post-controls .save-draft').on('click', function(){
            tempThis.saveDraftTemplate(template, false, function() {
                window.controller.renderView('templateEditSuccess');
            })
        });

        window.jquery('.post-edit .post-controls .preview').on('click', function(){
            tempThis.saveDraftTemplate(template, true, function() {
                window.controller.renderView('templateEdit');
                window.state.activeTemplate = template;
                window.controller.renderView('templatePreview');
            })
        });

        window.jquery('.post-edit .post-controls .publish').on('click', function() {
            tempThis.saveDraftTemplate(template, false, function() {
                template = window.state.activeTemplate;

                window.jquery('#container .post-edit').append(`
                    <div class="post-edit-loading">
                        <div class="post-edit-loading-inner">Uploading template to SAFE Network</div>
                    </div>
                `);

                file.createFile('templates' + path.sep + template.id + '.js', templateRenderer.compile(template, false), function(){
                    window.safe.uploadFile(file.getPath('templates' + path.sep + template.id + '.js'), template.networkPath + 'template.js')
                        .then(result => {
                            template.status = 1;
                            window.state.templates.replaceListItemById(window.state.templates.get('list'), template);

                            window.state.templates.save(function() {
                                window.jquery('.post-edit .post-edit-loading').remove();
                                window.controller.renderView('templateEdit');
                                window.state.activeTemplate = template;
                                window.controller.renderView('templateEditUploadSuccess');
                            });
                        });
                });
            });
        });

        let editorCss = ace.edit('editor-css'),
            editorBefore = ace.edit('editor-before'),
            editorAfter = ace.edit('editor-after'),
            editorJs = ace.edit('editor-js');

        editorCss.setValue(template ? template.css : '', -1);
        editorBefore.setValue(template ? template.templateBefore : '', -1);
        editorAfter.setValue(template ? template.templateAfter : '', -1);
        editorJs.setValue(template ? template.js : '', -1);
    }

    remove() {
        window.jquery('.post-edit .slug-trigger').off('click');
        window.jquery('.post-edit .post-controls .save-draft').off('click');
        window.jquery('.post-edit .post-controls .publish').off('click');
        window.jquery('.page .content').remove('.post-edit');
    }

    saveDraftTemplate(template, devOnly, callback) {
        if (!template) {
            template = {
                id: random.getRandomString(16),
                status: 0
            }
        }

        let editorCss = ace.edit('editor-css'),
            editorBefore = ace.edit('editor-before'),
            editorAfter = ace.edit('editor-after'),
            editorJs = ace.edit('editor-js');

        template.status = template.status === 1 ? 2 : template.status;
        template.title = window.jquery('#post-title').val();
        template.css = editorCss.getValue();
        template.js = editorJs.getValue();
        template.templateBefore = editorBefore.getValue();
        template.templateAfter = editorAfter.getValue();
        template.networkPath = window.jquery('.post-edit select[name="post-domain"]').val();
        template.networkPathCache = window.jquery('select[name="post-domain"] option[value="' + template.networkPath + '"]').text();

        let currentTemplates = window.state.templates.replaceListItemById(window.state.templates.get('list'), template);

        window.state.templates.set('list', currentTemplates);
        window.state.activeTemplate = template;

        file.createDirectory('templates');
        window.state.templates.save(function(){
            file.createFile('templates' + path.sep + template.id + '.js', templateRenderer.compile(template, true), callback);
        });
    }
}

module.exports = new templateEdit;