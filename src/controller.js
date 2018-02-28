const mock = require('./view/mock');
const loader = require('./view/loader');
const page = require('./view/page');
const domainList = require('./view/domainList');
const postList = require('./view/postList');
const postEdit = require('./view/postEdit');
const templateList = require('./view/templateList');
const templateEdit = require('./view/templateEdit');
const templatePreview = require('./view/templatePreview');
const filesList = require('./view/filesList');
const filesEdit = require('./view/filesEdit');
const settingsList = require('./view/settingsList');
const genericResponse = require('./view/genericResponse');

class controller {
    constructor() {
        this.renderView = this.renderView.bind(this);

        // All views need to be classes which expose a `render` and a `remove` method
        this.views = {
            mock: mock,
            loader: loader,
            page: page,
            domainList: domainList,
            postList: postList,
            postEdit: postEdit,
            postEditSuccess: new genericResponse('postEditSuccess', ['page', 'postEdit'], 'Your draft post was saved locally.'),
            postEditUploadSuccess: new genericResponse('postEditUploadSuccess', ['page', 'postEdit'], 'Your post was published to the SAFE Network.'),
            templateList: templateList,
            templateEdit: templateEdit,
            templateEditSuccess: new genericResponse('templateEditSuccess', ['page', 'templateEdit'], 'Your draft template was saved locally'),
            templateEditUploadSuccess: new genericResponse('templateEditUploadSuccess', ['page', 'templateEdit'], 'Your template was published to the SAFE Network.'),
            templatePreview: templatePreview,
            filesList: filesList,
            filesEdit: filesEdit,
            filesEditSuccess: new genericResponse('filesEditSuccess', ['page', 'filesEdit'], 'Your file was published to the SAFE network.'),
            settingsList: settingsList,
            settingsListSuccess: new genericResponse('settingsListSuccess', ['page', 'settingsList'], 'Your settings have been saved.')
        };

        this.activeView = 'mock';
        this.renderView('loader');
    }

    /**
     * Removes the currently rendered view and renders a new view
     *
     * @param {string} viewIdentifier
     * @param {boolean} forceDependencyRender  Optional
     */
    renderView(viewIdentifier, forceDependencyRender) {
        let currentView = this.views[this.activeView],
            newView = this.views[viewIdentifier],
            dependenciesMatch = this.isMatchingDependencies(currentView.dependencies, newView.dependencies);
        forceDependencyRender = typeof forceDependencyRender !== "undefined";

        this.views[this.activeView].remove();

        if (!dependenciesMatch || forceDependencyRender === true) {
            for (let i = 0; i < currentView.dependencies.length; i++) {
                this.views[currentView.dependencies[i]].remove();
            }

            for (let i = 0; i < newView.dependencies.length; i++) {
                this.views[newView.dependencies[i]].render();
            }
        }

        this.views[viewIdentifier].render();
        this.activeView = viewIdentifier;
    }

    /**
     * Compare ordered dependencies to see if they are the same
     *
     * @param dependencyChain1
     * @param dependencyChain2
     * @returns {boolean}
     */
    isMatchingDependencies(dependencyChain1, dependencyChain2) {
        if (dependencyChain1.length !== dependencyChain2.length) {
            return false;
        }

        for (let i = dependencyChain1.length; i--;) {
            if (dependencyChain1[i] !== dependencyChain2[i]) {
                return false;
            }
        }

        return true;
    }
}

module.exports = new controller;