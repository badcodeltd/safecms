class baseSuccess {
    /**
     *
     * @param {string} relevantTimeout
     * @param {string} message
     */
    render(relevantTimeout, message) {
        window.jquery('#container').append(`<div class="post-edit-success">` + message + `</div>`);

        window.state.relevantTimeout = setTimeout(function(){
            window.jquery('#container').find('.post-edit-success').remove();
        }, 3000);
    }

    /**
     *
     * @param {string} relevantTimeout
     */
    remove(relevantTimeout) {
        clearTimeout(window.state.relevantTimeout);
        window.jquery('#container').find('.post-edit-success').remove();
    }
}

module.exports = new baseSuccess;