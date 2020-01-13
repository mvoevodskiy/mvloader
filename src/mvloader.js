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
    controllers = {};
    defaults = {
        classes: {
            controllers: {},
            handlers: {},
        },
        controllers: {},
        db: {
            name: 'mvloader',
        },
        handlers: {},
    };
    handlers = {};

    constructor (config) {
        this.MT = new MVTools;
        this.LTools = new LTools(this);
        this.loadConfig(config);
    }

    loadToDefaults (config) {
        this.defaults = this.MT.mergeRecursive(this.defaults, config);
    }

    loadConfig (config) {
        this.config = this.MT.mergeRecursive(this.defaults, this.config, config);
    }

    init () {
        // console.log('MV LOADER. INIT START');
        Promise.resolve()
            .then(() => this.initHandlers())
            .then(() => this.initControllers());
    }

    async initControllers () {
        return this.LTools.loadClassesFromConfig(this, 'controllers')
            .then(this.LTools.assignUpControllersToProcess());
    }

    async initHandlers () {
        return this.LTools.loadClassesFromConfig(this, 'handlers');
    }

}

module.exports = MVLoader;