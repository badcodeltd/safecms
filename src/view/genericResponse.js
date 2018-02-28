/**
 * Defines a custom response view used when you need to re-render a view with a popup message
 */
class genericResponse {
    /**
     * @param name
     * @param dependencies
     * @param message
     */
    constructor(name, dependencies, message) {
        this.dependencies = dependencies;
        this.name = name;
        this.message = message;
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.jquery('#container').append(`<div class="post-edit-success">` + this.message + `</div>`);

        window.state[this.name] = setTimeout(function(){
            window.jquery('#container').find('.post-edit-success').remove();
        }, 3000);
    }

    remove() {
        clearTimeout(window.state[this.name]);
        window.jquery('#container').find('.post-edit-success').remove();
    }
}

// Does not export a new object, needs to be instantiated by the controller
module.exports = genericResponse;