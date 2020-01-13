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

    assignUpControllersToProcess() {
        for (let key in this.L.config.controllers) {
            if (this.L.config.controllers.hasOwnProperty(key)) {
                this.assignControllerToProcess(this.L.config.controllers[key]);
            }
        }
    }

    assignControllerToProcess (assignee) {
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

    async loadClassesFromConfig (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
        let classes = src.config.classes[type];
        for (let name in classes) {
            if (classes.hasOwnProperty(name)) {
                if (onlyName === '' || onlyName === name) {
                    let objectConfig = this.MT.extract(type + '.' + name, src.config, {});
                    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);

                    if (!this.MT.empty(classes[name].exportConfig)) {
                        src.loadConfig(classes[name].exportConfig);
                    }

                    let object = await this.raiseClass(classes[name], objectConfig);
                    if (object !== false) {
                        src[type][name] = object;
                    }
                }
            }
        }
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG END');
    }

    async initClassesFromConfig (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG START');
        let classes = src.config.classes[type];
        for (let name in classes) {
            if (classes.hasOwnProperty(name)) {
                if (onlyName === '' || onlyName === name) {
                    try {
                        src[type][name].init();
                    } catch (e) {

                    }
                }
            }
        }
        // console.log('MV LOADER TOOLS. INIT CLASSES FROM CONFIG END');
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