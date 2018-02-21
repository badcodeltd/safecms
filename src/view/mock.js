/**
 * Provides a mock view which can be used by the controller onload or for testing
 */
class mock {
    constructor() {
        this.dependencies = [];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {}
    remove() {}
}

module.exports = new mock;