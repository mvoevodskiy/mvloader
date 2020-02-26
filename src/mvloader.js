const MVTools = require('mvtools');
const MVLoaderBase = require('./mvloaderbase');
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
class MVLoader extends MVLoaderBase {

    ext = {
        semis: {},
        controllers: {},
        handlers: {},
    };

    DB = null;
    services = {};

    constructor (...config) {
        let defaults = {
            ext: {
                classes: {
                    semis: {},
                    controllers: {},
                    handlers: {},
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
        super(defaults, ...config);
        this.LTools = new LTools(this);
    }

    async init () {
        // console.log('MV LOADER. INIT START');
        return Promise.resolve()
            .then(() => this.loadExtObjects())
            .then(() => this.initExtClasses())
            .then(() => this.initFinishExtClasses());
    }

    async loadExtObjects () {
        for (let type of Object.keys(this.config.ext.classes)) {
            await this.LTools.loadExtObjects(this, type);
        }
    }

    async initExtClasses () {
        for (let type of Object.keys(this.ext)) {
            await this.LTools.initExtObjects(this, type);
        }
    }

    async initFinishExtClasses () {
        // FALLBACK FOR this.DB property
        if (!this.MT.empty(this.DB) && this.MT.empty(this.services.DB)) {
            this.services.DB = this.DB;
        }
        for (let type of Object.keys(this.ext)) {
            await this.LTools.initFinishExtObjects(this, type);
        }
    }

}

module.exports = MVLoader;