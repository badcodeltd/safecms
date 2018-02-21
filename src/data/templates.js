dataObject = require('./dataObject');

class templates extends dataObject {
    constructor() {
        super();
        this.identifier = 'templates';

        // Default templates
        this.set('list',
            [
                {
                    id: 1,
                    title: 'Whisper',
                    status: 1,
                    networkPath: false,
                    css:`body {
    padding: 4em;
    margin: 0;
    font-family: Helvetica, Arial, sans-serif;
    background-color: #f1f1f1;
}

.content {
    max-width: 800px;
    margin: 0 auto;
    padding: 1em 2em;
    background-color: #fff;
    box-shadow: 0 0 4px #ccc;
}

.advert {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: calc(800px + 4em);
    margin: 0 auto;
    text-align: right;
}

.button, .advert a {
    display: inline-block;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    background-color: #31709a;
}

.button {
    margin: 2em 0 1em;
    padding: 10px 15px;
    font-size: 14px;
}

.advert a {
    padding: 7px 15px 5px;
    font-size: 10px;
}

.button:hover, .advert a:hover {
    background-color: #3d9fdc;
}

@media (max-width: 600px) {
    body {
        padding: 2em;
    }
}
            `,
                    js: "",
                    templateBefore: `<div class="content">`,
                    templateAfter: `</div>`
                }
            ]
        );
    }
}

module.exports = new templates;