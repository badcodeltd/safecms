class templateList {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        let templateListHtml = '';

        window.state.templates.get('list').map(function(template) {
            let templateStatusText = template.status === 1 ? 'Published' : (template.status === 2 ? 'Edited' : 'Draft');

            templateListHtml += `<div class="item" data-id="` + template.id + `">
                <div class="info">` + template.title + `</div>
                <div class="info">
                    <div class="tag-` + templateStatusText.toLocaleLowerCase() + `">
                        ` + templateStatusText + `
                    </div>
                </div>
            </div>`
        });

        window.jquery('.page .content').html(
            `<div class="post-list template-list">
                <div class="post-headings">
                    <div class="heading">Name</div>
                    <div class="heading">Status</div>
                </div>
                <div class="posts">
                    ` + (templateListHtml.length ? templateListHtml : `<div class="empty">No templates</div>`) + `
                </div>
            </div>
            <div class="post-actions">
                <div class="button">Create template</div>
            </div>`
        );

        window.jquery('.template-list .posts .item').on('click', function(){
            let id = window.jquery(this).data('id'),
                templates = window.state.templates.get('list');

            for (let i = 0; i < templates.length; i++) {
                if (templates[i].id === id) {
                    window.state.activeTemplate = templates[i];
                }
            }

            if (window.state.activeTemplate) {
                window.controller.renderView('templateEdit');
            } else {
                alert('There was an error loading this template, please restart the app and try again');
            }
        });

        window.jquery('.post-actions .button').on('click', function(){
            window.state.activeTemplate = false;
            window.controller.renderView('templateEdit')
        });
    }

    remove() {
        window.jquery('.post-actions .button').off('click');
        window.jquery('.template-list .posts .item').off('click');
        window.jquery('.page .content').remove('.template-list');
    }
}

module.exports = new templateList;