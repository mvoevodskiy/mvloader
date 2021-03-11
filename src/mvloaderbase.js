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
