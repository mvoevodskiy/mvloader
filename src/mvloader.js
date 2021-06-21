const { MVLoaderBase, basicResponse } = require('./mvloaderbase')
const LTools = require('./ltools')

/**
 * @class MVLoader
 *
 * @property {Object} config
 * @property {Object} controllers
 * @property {Object} defaults
 * @property {Object} handlers
 *
 * @property {import('mvtools)} MT
 * @property {LTools} LTools
 */
class MVLoader extends MVLoaderBase {
  constructor (...config) {
    const defaults = {
      ext: {
        classes: {
          semis: {},
          controllers: {},
          handlers: {}
        },
        configs: {
          controllers: {},
          handlers: {},
          semis: {}
        }
      },
      db: {
        name: 'mvloader'
      }
    }
    super(defaults, ...config)
    this.ext = {
      semis: {},
      controllers: {},
      handlers: {}
    }
    this.DB = null
    this.services = {}
    this.LTools = new LTools(this)
  }

  async init () {
    // console.log('MV LOADER. INIT START');
    return Promise.resolve()
      .then(() => this.loadExtConfigs())
      .then(() => this.raiseExtObjects())
      .then(() => this.applyMiddlewares())
      .then(() => this.initExtObjects())
      .then(() => this.initFinishExtObjects())
  }

  async loadExtConfigs () {
    for (const type of Object.keys(this.config.ext.classes)) {
      await this.LTools.loadExtConfigs(this, type)
    }
  }

  async applyMiddlewares () {
    for (const type of Object.keys(this.config.ext.classes)) {
      await this.LTools.applyMiddlewares(this, type)
    }
  }

  async raiseExtObjects () {
    for (const type of Object.keys(this.config.ext.classes)) {
      await this.LTools.raiseExtObjects(this, type)
    }
  }

  async initExtObjects () {
    for (const type of Object.keys(this.ext)) {
      await this.LTools.initExtObjects(this, type)
    }
  }

  async initFinishExtObjects () {
    // FALLBACK FOR this.DB property
    if (!this.MT.empty(this.DB) && this.MT.empty(this.services.DB)) {
      this.services.DB = this.DB
    }
    for (const type of Object.keys(this.ext)) {
      await this.LTools.initFinishExtObjects(this, type)
    }
  }
}

module.exports = { MVLoader, MVLoaderBase, basicResponse }
