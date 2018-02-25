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
        let compiledHtmlA = devOnly ? this.replaceUrlsWithLocalPaths(templateObject.templateBefore, templateObject.networkPath) : templateObject.templateBefore,
            compiledHtmlB = devOnly ? this.replaceUrlsWithLocalPaths(templateObject.templateBefore, templateObject.networkPath) : templateObject.templateAfter;

        return uglifyjs.minify(this.generate(JSON.stringify({
            css: btoa(this.sanitizeCss(csso.minify(templateObject.css).css)),
            htmla: btoa(compiledHtmlA),
            htmlb: btoa(compiledHtmlB),
            js: btoa(uglifyjs.minify(templateObject.js).code)
        }), devOnly)).code;
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
                ` + (devOnly ? `_b.onclick = function(){ alert('This button is for local styling purposes and is disabled in previews'); return false; }; ` : ``) + `
                _c[v](_b);
            } ` + (advertDisabled ? `document[n]('safe-advert')[0].setAttribute('style', 'display: none;')` : ``);
    }

    replaceUrlsWithLocalPaths(content, networkPath) {
        let files = window.state.files.get('list'),
            urlRegularExpression = /src="(?!safe:\/\/)(\/?[^"]*)"/g,
            matches = content.match(urlRegularExpression);

        if (!matches || matches === null) {
            return content;
        }

        for (let i = 0; i < files.length; i++) {
            let relativeUrlRegularExpression = new RegExp("/?" + files[i].slug, "g");

            for (let n = 0; n < matches.length; n++) {
                let temporaryMatch = matches[n],
                    actualUri = temporaryMatch.replace(/"/, '').replace(/src=/, '');

                if ((networkPath === files[i].networkPath) && relativeUrlRegularExpression.test(actualUri)) {
                    content = content.replace(matches[n], 'src="' + files[i].path + '"');
                }
            }
        }

        return content;
    }

    sanitizeCss(css) {
        return css.replace(/"/g, "'");
    }
}

module.exports = new template;