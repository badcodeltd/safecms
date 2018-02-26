/**
 * Polyfill for unicode support
 */
class encoding {
    constructor() {
        this.getDefaultFileEncoding = this.getDefaultFileEncoding.bind(this);
        this.encodeUnicodeToBase64 = this.encodeUnicodeToBase64.bind(this);
        this.decodeUnicodeFromBase64 = this.decodeUnicodeFromBase64.bind(this);
    }

    /**
     * Use utf8 instead of latin1 which seems to be the node default since 6.4
     *
     * @returns {string}
     */
    getDefaultFileEncoding() {
        return 'utf8';
    }

    /**
     * first we use encodeURIComponent to get percent-encoded UTF-8,
     * then we convert the percent encodings into raw bytes which
     * can be fed into btoa.
     *
     * @param {string} str
     * @returns {string}
     */
    encodeUnicodeToBase64(str) {
        return btoa(
            encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            })
        );
    }

    /**
     * Going backwards: from bytestream, to percent-encoding, to original string.
     *
     * @param {string} str
     * @returns {string}
     */
    decodeUnicodeFromBase64(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}

module.exports = new encoding;