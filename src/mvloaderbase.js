const MVTools = require('mvtools')

/**
 * @class MVLoaderBase
 *
 * @property {Object} config
 * @property {Object} defaults
 *
 * @property {MVTools} MT
 */
class MVLoaderBase {
  constructor (...config) {
    this.caption = ''
    this.config = {}
    this.MT = new MVTools()
    this.loadConfig(...config)
  }

  loadConfig (...config) {
    if (this.MT.empty(this.config)) {
      this.config = this.MT.copyObject(this.defaults || {})
    }
    this.config = this.MT.mergeRecursive(this.config, ...config)
  }

  async init () {}

  async initFinish () {}
}

MVLoaderBase.exportConfig = {
  ext: {
    classes: {},
    configs: {}
  }
}

module.exports = MVLoaderBase
