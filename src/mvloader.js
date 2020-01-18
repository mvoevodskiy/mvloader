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
            .then(() => this.loadClasses())
            .then(() => this.initClasses());
    }

    async loadClasses () {
        for (let type of Object.keys(this.config.ext.classes)) {
            await this.LTools.loadClassesFromConfig(this, type);
        }
    }

    async initClasses () {
        for (let type of Object.keys(this.ext.classes)) {
            await this.LTools.initClassesFromConfig(this, type);
        }
    }

}

module.exports = MVLoader;