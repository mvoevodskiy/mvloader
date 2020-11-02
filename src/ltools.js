/**
 * @class LTools
 *
 * @property {MVLoader} App
 * @property {Object.<import('mvtools')>} MT
 */
class LTools {
  constructor (App) {
    this.L = App
    this.MT = this.L.MT
  }

  assignObjectToProcess (assignee) {
    if (!this.MT.empty(assignee.caption)) {
      this.assignToProcess(assignee, assignee.caption)
    }
  }

  assignToProcess (assignee, property) {
    this.assignToObject(assignee, property, process)
  }

  assignToObject (assignee, property, target) {
    Object.defineProperty(target, property, {
      value: assignee,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }

  async loadExtConfigs (src, type, onlyName = '') {
    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
    const processed = []
    let next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed)
    while (next.length > 0) {
      for (const name of next) {
        if (Object.prototype.hasOwnProperty.call(src.config.ext.classes[type], name)) {
          if ((onlyName === '' || onlyName === name) && Object.prototype.hasOwnProperty.call(src.config.ext.classes[type][name], 'exportConfig')) {
            // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);

            if (!this.MT.empty(src.config.ext.classes[type][name].exportConfig)) {
              src.loadConfig(src.config.ext.classes[type][name].exportConfig)
            }
          }
          processed.push(name)
        }
      }
      next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed)
      // console.log(Object.keys(src.config.ext.classes[type]), processed, next);
    }
    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG END');
  }

  async raiseExtObjects (src, type, onlyName = '') {
    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
    const processed = []
    let next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed)
    while (next.length > 0) {
      for (const name of next) {
        if (Object.prototype.hasOwnProperty.call(src.config.ext.classes[type], name)) {
          if (onlyName === '' || onlyName === name) {
            // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);

            const objectConfig = this.MT.extract(type + '.' + name, src.config.ext.configs, {})
            const object = await this.raiseClass(src.config.ext.classes[type][name], objectConfig)
            if (object !== false) {
              src.ext[type] = src.ext[type] || {}
              src.ext[type][name] = object
              this.assignObjectToProcess(src.ext[type][name])
            }
          }
          processed.push(name)
        }
      }
      next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed)
      // console.log(Object.keys(src.config.ext.classes[type]), processed, next);
    }
    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG END');
  }

  async initExtObjects (src, type, onlyName = '') {
    // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG START');
    const objects = src.ext[type]
    if (this.MT.empty(objects)) {
      return
    }
    for (const name in objects) {
      if (Object.prototype.hasOwnProperty.call(objects, name)) {
        if (onlyName === '' || onlyName === name) {
          try {
            const objectConfig = this.MT.extract(type + '.' + name, src.config.ext.configs, {})
            if ('loadConfig' in src.ext[type][name]) {
              src.ext[type][name].loadConfig(objectConfig)
              // } else {
              //     console.debug('LOAD CONFIG IN ', type, '.', name, ' NOT FOUND');
            }
            if ('init' in src.ext[type][name]) {
              await src.ext[type][name].init()
            }
          } catch (e) {
            console.error('INIT EXT OBJECT ' + type + ' ' + name + ' FAILED. ERROR: ', e)
          }
        }
      }
    }
    // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG END');
  }

  async initFinishExtObjects (src, type, onlyName = '') {
    // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG START');
    const objects = src.ext[type]
    if (this.MT.empty(objects)) {
      return
    }
    for (const name in objects) {
      if (Object.prototype.hasOwnProperty.call(objects, name)) {
        if (onlyName === '' || onlyName === name) {
          try {
            if ('initFinish' in src.ext[type][name]) {
              await src.ext[type][name].initFinish()
            }
          } catch (e) {
            console.error('FINISH INIT EXT OBJECT ' + type + ' ' + name + ' FAILED. ERROR: ', e)
          }
        }
      }
    }
    // console.log('MV LOADER TOOLS. INIT FINISHED CLASSES FROM CONFIG END');
  }

  raiseClass (Proto, config = {}) {
    let object = false
    try {
      object = new Proto(this.L, config)
    } catch (e) {
      console.error('RAISE CLASS ' + Proto.name + ' FAILED. SKIPPED. ERROR: ', e)
    }
    return object
  }
}

module.exports = LTools
