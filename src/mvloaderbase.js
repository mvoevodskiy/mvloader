const MVTools = require('mvtools');

/**
 * @class MVLoaderBase
 *
 * @property {Object} config
 * @property {Object} defaults
 *
 * @property {MVTools} MT
 */
class MVLoaderBase {

    static exportConfig = {ext: {}};

    caption = '';
    config = {};
    defaults = {};

    constructor (...config) {
        this.MT = new MVTools;
        this.loadConfig(...config);
    }

    loadConfig (...config) {
        this.config = this.MT.mergeRecursive(this.defaults, this.config, ...config);
    }

    async init () {}

    async initFinish () {}

}

module.exports = MVLoaderBase;