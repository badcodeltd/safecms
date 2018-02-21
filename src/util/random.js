const crypto = require("crypto");

class random {
    /**
     * @param length
     * @returns {string}
     */
    getRandomString(length) {
        return crypto.randomBytes(length / 2).toString('hex');
    }
}

module.exports = new random;