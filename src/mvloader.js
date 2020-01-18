const MVTools = require('mvtools');
const LTools = require('./ltools');


/**
 * @class MVLoader
 *
 * @property {Object} config
 * @property {Object} controllers
 * @property {Object} defaults
 * @property {Object} handlers
 *
 * @property {MVTools} MT
 * @property {LTools} LTools
 */
class MVLoader {

    config = {};
    defaults = {
        ext: {
            classes: {
                controllers: {},
                handlers: {},
                semis: {},
            },
            configs: {
                controllers: {},
                handlers: {},
                semis: {},
            }
        },
        db: {
            name: 'mvloader',
        },
    };
    ext = {
        controllers: {},
        handlers: {},
        semis: {},
    };

    constructor (...config) {
        this.MT = new MVTools;
        this.LTools = new LTools(this);
        this.loadConfig(...config);
    }

    loadToDefaults (config) {
        this.defaults = this.MT.mergeRecursive(this.defaults, config);
    }

    loadConfig (...config) {
        this.config = this.MT.mergeRecursive(this.defaults, this.config, ...config);
    }

    async init () {
        // console.log('MV LOADER. INIT START');
        return Promise.resolve()
            .then(() => this.loadHandlers())
            .then(() => this.loadControllers())
            .then(() => this.loadSemis())
            .then(() => this.initHandlers())
            .then(() => this.initControllers())
            .then(() => this.initSemis());
    }

    async loadControllers () {
        return this.LTools.loadClassesFromConfig(this, 'controllers')
            .then(() => this.LTools.assignUpControllersToProcess());
    }

    async loadHandlers () {
        return this.LTools.loadClassesFromConfig(this, 'handlers');
    }

    async loadSemis () {
        return this.LTools.loadClassesFromConfig(this, 'semis');
    }

    async initControllers () {
        return this.LTools.initClassesFromConfig(this, 'controllers')
    }

    async initHandlers () {
        return this.LTools.initClassesFromConfig(this, 'handlers');
    }

    async initSemis () {
        return this.LTools.initClassesFromConfig(this, 'semis');
    }

}

module.exports = MVLoader;