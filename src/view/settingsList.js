class settingsList {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        let mediumEditorState = window.state.settings.get('medium-editor'),
            safecmsAdvertState = window.state.settings.get('safecms-advert');

        window.jquery('.page .content').html(`
            <div class="settings">
                <form>
                    <label for="medium-editor">Medium editor</label>
                    <div class="settings-item">
                        <select id="medium-editor" name="medium-editor">
                            <option value="1" ` + ((mediumEditorState === null || mediumEditorState) ? 'selected' : '') + `>Enabled</option>
                            <option value="0" ` + ((safecmsAdvertState !== null && !mediumEditorState) ? 'selected' : '') + `>Disabled</option>
                        </select>
                        <div class="setting-description">Disabling this feature allows you to write raw HTML in your posts instead of using the Medium WYSIWYG editor. <strong>HTML posts are not backwards compatible with the Medium editor, so disabling this should not be reversed.</strong></div>
                    </div>                    
                    <label for="medium-editor">"Built with SafeCMS" advert in Whisper</label>
                    <div class="settings-item">
                        <select id="safecms-advert" name="safecms-advert">
                            <option value="1" ` + ((safecmsAdvertState === null || safecmsAdvertState) ? 'selected' : '') + `>Enabled</option>
                            <option value="0" ` + ((safecmsAdvertState !== null && !safecmsAdvertState) ? 'selected' : '') + `>Disabled</option>
                        </select>
                        <div class="setting-description">This feature supports the Safe-CMS project by displaying a SafeCMS button at the bottom of the default (Whisper) template. The template must be re-published after changing this option.</div>
                    </div>
                    <div class="button">Save settings</div>
                </form>
            </div>
        `);

        window.jquery('.settings .button').on('click', function() {
            let options = ['medium-editor', 'safecms-advert'];

            for (let i = 0; i < options.length; i++) {
                let item = options[i];
                window.state.settings.set(item, parseInt(window.jquery('#' + item).val()));
            }

            window.state.settings.save(function(){
                window.controller.renderView('settingsListSuccess');
            });
        });
    }

    remove() {
        window.jquery('.settings .button').off('click');
        window.jquery('.page .content').remove('.settings');
    }
}

module.exports = new settingsList;