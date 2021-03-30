const MVTools = require('mvtools')
const { MiddlewareManager } = require('js-middleware')

/**
 * @typedef {Object} basicResponse
 * @property {boolean} success
 * @property {string} message
 * @property {Object<string, *>} data
 */

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
        if (Array.isArray(Middleware)) this.use(Middleware[0], Middleware[1])
        else this.use(new Middleware(this))
      }
    }
  }

  use (step, method) {
    let applied = false
    if (method !== undefined) {
      if (typeof method === 'string') {
        method = this.MT.extract(method)
      }
      if (!this.MT.empty(method)) {
        this.MiddlewareManager.use(step, method)
        applied = true
      }
    } else if (!this.MT.empty(step)) {
      method = typeof step === 'string' ? this.MT.extract(step) : step
      this.MiddlewareManager.use(method)
      applied = true
    }
    if (!applied) console.error('MIDDLEWARE APPLY FAILED IN', this.constructor.name)
  }

  /**
   *
   * @param {boolean} success
   * @param {string} message=''
   * @param {Object} data={}
   * @param {int|string|boolean} code=false
   * @return {basicResponse}
   */
  response (success, message = '', data = {}, code = false) {
    if (code !== false) data.code = code
    return { success, message, data }
  }

  /**
   *
   * @param {string} message=''
   * @param {Object} data={}
   * @param {int|string|boolean} code=false
   * @return {basicResponse}
   */
  failure (message = '', data = {}, code = false) {
    return this.response(false, message, data, code)
  }

  /**
   *
   * @param {string} message=''
   * @param {Object} data={}
   * @param {int|string|boolean} code=false
   * @return {basicResponse}
   */
  success (message = '', data = {}, code = false) {
    return this.response(true, message, data, code)
  }
}

MVLoaderBase.exportConfig = {
  ext: {
    classes: {},
    configs: {}
  }
}

module.exports = MVLoaderBase
