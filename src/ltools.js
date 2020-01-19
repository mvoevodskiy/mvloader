/**
 * @class LTools
 *
 * @property {MVLoader} App
 * @property {MVTools} MT
 */
class LTools {
    constructor(App) {
        this.L = App;
        this.MT = this.L.MT;

    }

    assignObjectToProcess (assignee) {
        if (!this.MT.empty(assignee.caption)) {
            this.assignToProcess(assignee, assignee.caption)
        }
    }

    assignToProcess (assignee, property) {
        this.assignToObject(assignee, property, process);
    }

    assignToObject (assignee, property, target) {
        Object.defineProperty(target, property, {
            value: assignee,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    async loadExtObjects (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
        let classes = src.config.ext.classes[type];
        for (let name in classes) {
            if (classes.hasOwnProperty(name)) {
                if (onlyName === '' || onlyName === name) {
                    let objectConfig = this.MT.extract(type + '.' + name, src.config.ext.configs, {});
                    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);

                    if (!this.MT.empty(classes[name].exportConfig)) {
                        src.loadConfig(classes[name].exportConfig);
                    }

                    let object = await this.raiseClass(classes[name], objectConfig);
                    if (object !== false) {
                        src.ext[type] = src.ext[type] || {};
                        src.ext[type][name] = object;
                        this.assignObjectToProcess(src.ext[type][name]);
                    }
                }
            }
        }
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG END');
    }

    async initExtObjects (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG START');
        let objects = src.ext[type];
        if (this.MT.empty(objects)) {
            return;
        }
        for (let name in objects) {
            if (objects.hasOwnProperty(name)) {
                if (onlyName === '' || onlyName === name) {
                    try {
                        let objectConfig = this.MT.extract(type + '.' + name, src.config.ext.configs, {});
                        src.ext[type][name].loadConfig(objectConfig);
                        src.ext[type][name].init();
                    } catch (e) {

                    }
                }
            }
        }
        // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG END');
    }

    async initFinishExtObjects (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG START');
        let objects = src.ext[type];
        if (this.MT.empty(objects)) {
            return;
        }
        for (let name in objects) {
            if (objects.hasOwnProperty(name)) {
                if (onlyName === '' || onlyName === name) {
                    try {
                        src.ext[type][name].initFinish();
                    } catch (e) {}
                }
            }
        }
        // console.log('MV LOADER TOOLS. INIT FINISHED CLASSES FROM CONFIG END');
    }

    raiseClass (proto, config = {}) {
        let object = false;
        try {
            object = new proto(this.L, config);
        } catch (e) {
            object = false;
            console.error('RAISE CLASS ' + proto.name + ' FAILED. SKIPPED. ERROR: ', e);
        }
        return object;
    }


}

module.exports = LTools;