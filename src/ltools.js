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

    async loadExtConfigs (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
        let processed = [];
        let next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed);
        while (next.length > 0) {
            for (let name of next) {
                if (src.config.ext.classes[type].hasOwnProperty(name)) {
                    if ((onlyName === '' || onlyName === name) && src.config.ext.classes[type][name].hasOwnProperty('exportConfig')) {
                        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);

                        if (!this.MT.empty(src.config.ext.classes[type][name].exportConfig)) {
                            src.loadConfig(src.config.ext.classes[type][name].exportConfig);
                        }
                    }
                    processed.push(name);
                }
            }
            next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed);
            // console.log(Object.keys(src.config.ext.classes[type]), processed, next);
        }
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG END');
    }

    async raiseExtObjects (src, type, onlyName = '') {
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
        let processed = [];
        let next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed);
        while (next.length > 0) {
            for (let name of next) {
                if (src.config.ext.classes[type].hasOwnProperty(name)) {
                    if (onlyName === '' || onlyName === name) {
                        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);

                        let objectConfig = this.MT.extract(type + '.' + name, src.config.ext.configs, {});
                        let object = await this.raiseClass(src.config.ext.classes[type][name], objectConfig);
                        if (object !== false) {
                            src.ext[type] = src.ext[type] || {};
                            src.ext[type][name] = object;
                            this.assignObjectToProcess(src.ext[type][name]);
                        }
                    }
                    processed.push(name);
                }
            }
            next = this.MT.arrayDiff(Object.keys(src.config.ext.classes[type]), processed);
            // console.log(Object.keys(src.config.ext.classes[type]), processed, next);
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
                        if ('loadConfig' in src.ext[type][name]) {
                            src.ext[type][name].loadConfig(objectConfig);
                        // } else {
                        //     console.debug('LOAD CONFIG IN ', type, '.', name, ' NOT FOUND');
                        }
                        if ('init' in src.ext[type][name]) {
                            await src.ext[type][name].init();
                        }
                    } catch (e) {
                        console.error('INIT EXT OBJECT ' + type + ' ' + name + ' FAILED. ERROR: ', e);
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
                        if ('initFinish' in src.ext[type][name]) {
                            await src.ext[type][name].initFinish();
                        }
                    } catch (e) {
                        console.error('FINISH INIT EXT OBJECT ' + type + ' ' + name + ' FAILED. ERROR: ', e);
                    }
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