const csso = require('csso');
const uglifyjs = require('uglify-js');

class template {
    constructor() {
        this.generate = this.generate.bind(this);
        this.sanitizeCss = this.sanitizeCss.bind(this);
    }

    /**
     * Convert a template object to a template.js compliant code segment
     *
     * @param templateObject
     * @param devOnly
     * @returns {string}
     */
    compile(templateObject, devOnly) {
        return uglifyjs.minify(this.generate(JSON.stringify({
            css: btoa(this.sanitizeCss(csso.minify(templateObject.css).css)),
            htmla: btoa(templateObject.templateBefore),
            htmlb: btoa(templateObject.templateAfter),
            js: btoa(uglifyjs.minify(templateObject.js).code)
        }))).code;
    }

    /**
     * Takes a JSON string and generates a (tiny) self-invoking template function
     *
     * @param {string} templateString
     * @param {boolean} devOnly
     * @returns {string}
     */
    generate(templateString, devOnly) {
        let advertDisabled = window.state.settings.get('safecms-advert') === 0;
        return `
            var _t = JSON.parse('` + templateString + `')
                _d = document,
                _p = window.location.pathname,
                _h = _d.getElementsByTagName('head')[0],
                _s = _d[a='createElement']('style');
                _j = _d[a]('script'),
                _b = _d[a]('a');
            _s[v='appendChild'](_d[b='createTextNode'](atob(_t.css)));
            _s.id = 'cms-s';
            _j[v](_d[b](atob(_t.js)));
            _h[v='appendChild'](_s);
            ` + (!devOnly ? `_h[v](_j)` : ``) + `
            var _o = _d[g='getElementById']('c').innerHTML,
                _n = atob(_t.htmla) + _o + atob(_t.htmlb);
            _d[g]('c').innerHTML = _n;
            
            var _c = _d[n='getElementsByClassName']('content')[0];
            if (_p != "/" && _p != "/index.html") {
                _b.href = '/';
                _b.className = "button";
                _b.innerHTML = "Back to home";
                _c[v](_b);
            } ` + (advertDisabled ? `document[n]('safe-advert')[0].setAttribute('style', 'display: none;')` : ``);
    }

    sanitizeCss(css) {
        return css.replace(/"/g, "'");
    }
}

module.exports = new template;