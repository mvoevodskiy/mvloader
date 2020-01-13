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
        if (!this.L.MT.empty(assignee.caption)) {
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

    async loadClassesFromConfig (src, type, init = true, onlyName = '') {
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG START');
        for (let name in src.config.classes[type]) {
            if (src.config.classes[type].hasOwnProperty(name)) {
                if (onlyName === '' || onlyName === name) {
                    let objectConfig = this.L.MT.extract(type + '.' + name, src.config, {});
                    // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG. CONFIG PATH: ' + type + '.' + name + ', CONFIG: ', objectConfig);
                    let object = await this.raiseClass(
                        src.config.classes[type][name],
                        objectConfig,
                        init
                    );
                    if (object !== false) {
                        src[type][name] = object;
                    }
                }
            }
        }
        // console.log('MV LOADER TOOLS. LOAD CLASSES FROM CONFIG END');
    }

    async raiseClass (proto, config = {}, init = false) {
        let object = false;
        try {
            object = new proto(this.L, config);
            if (init) {
                await object.init();
            }
        } catch (e) {
            object = false;
            console.error('RAISE CLASS ' + proto.name + ' FAILED. SKIPPED. ERROR: ', e);
        }
        return object;
    }


}

module.exports = LTools;