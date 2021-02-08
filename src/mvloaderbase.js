const MVTools = require('mvtools')
const { MiddlewareManager } = require('js-middleware')

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
    this.config = { middlewares: [] }
    this.MT = new MVTools()
    this.loadConfig(...config)
    this.MiddlewareManager = new MiddlewareManager(this)
    this.useMultiple(this.config.middlewares)
  }

  loadConfig (...config) {
    if (this.MT.empty(this.config)) {
      this.config = this.MT.copyObject(this.defaults || {})
    }
    this.config = this.MT.mergeRecursive(this.config, ...config)
  }

  async init () {}

  async initFinish () {}

  useMultiple (middlewares) {
    if (Array.isArray(middlewares)) {
      for (const Middleware of middlewares) {
        this.use(new Middleware(this))
      }
    }
  }

  use (step, method) {
    if (typeof step === 'string') {
      this.MiddlewareManager.use(step, method)
    } else {
      method = step
      this.MiddlewareManager.use(method)
    }
  }
}

MVLoaderBase.exportConfig = {
  ext: {
    classes: {},
    configs: {}
  }
}

module.exports = MVLoaderBase
