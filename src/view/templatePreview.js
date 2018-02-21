const templateRenderer = require('../util/template');

class templatePreview {
    constructor() {
        this.dependencies = [];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').html(`
            <div id="c">
                <div id="c-return">Return</div>
                <h1>HTML Ipsum Presents</h1>
                <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
                <h2>Header Level 2</h2>
                <ol>
                   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                   <li>Aliquam tincidunt mauris eu risus.</li>
                </ol>
                <blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>
                <h3>Header Level 3</h3>
                <ul>
                   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                   <li>Aliquam tincidunt mauris eu risus.</li>
                </ul>
            </div>`);

        let template = window.state.activeTemplate,
            script = document.createElement("script");
        script.innerHTML = templateRenderer.compile(template, true);
        document.head.appendChild(script);

        window.jquery('#c-return').on('click', function() {
            window.controller.renderView('templateEdit');
        });
    }

    remove() {
        window.jquery('#cms-s').remove();
        window.jquery('#c').remove();
    }
}

module.exports = new templatePreview;