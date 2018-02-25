const mock = require('./view/mock');
const loader = require('./view/loader');
const page = require('./view/page');
const domainList = require('./view/domainList');
const postList = require('./view/postList');
const postEdit = require('./view/postEdit');
const postEditSuccess = require('./view/postEditSuccess');
const templateList = require('./view/templateList');
const templateEdit = require('./view/templateEdit');
const templateEditSuccess = require('./view/templateEditSuccess');
const templatePreview = require('./view/templatePreview');
const filesList = require('./view/filesList');
const filesEdit = require('./view/filesEdit');
const filesEditSuccess = require('./view/filesEditSuccess');
const settingsList = require('./view/settingsList');
const settingsListSuccess = require('./view/settingsListSuccess');

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
            postEditSuccess: postEditSuccess,
            templateList: templateList,
            templateEdit: templateEdit,
            templateEditSuccess: templateEditSuccess,
            templatePreview: templatePreview,
            filesList: filesList,
            filesEdit: filesEdit,
            filesEditSuccess: filesEditSuccess,
            settingsList: settingsList,
            settingsListSuccess: settingsListSuccess
        };

        this.activeView = 'mock';
        this.renderView('loader');
    }

    /**
     * Removes the currently rendered view and renders a new view
     *
     * @param {string} viewIdentifier
     */
    renderView(viewIdentifier) {
        let currentView = this.views[this.activeView],
            newView = this.views[viewIdentifier],
            dependenciesMatch = this.isMatchingDependencies(currentView.dependencies, newView.dependencies);

        this.views[this.activeView].remove();

        if (!dependenciesMatch) {
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