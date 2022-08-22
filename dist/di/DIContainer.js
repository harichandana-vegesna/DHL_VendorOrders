"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DI = void 0;
class DI {
    constructor() {
        this.perminantClasses = ['DBConnection', 'Keycloak', 'MemoryStore'];
        this.resolvedInstances = {};
        this.resolvedPerminantInstances = {};
    }
    static destroy() {
        this.context.resolvedInstances = {};
    }
    static get(className, ...params) {
        if (this.context === undefined || this.context === null) {
            this.context = new DI();
        }
        if (this.context.perminantClasses.indexOf(className.name) > -1) {
            if (this.context.resolvedPerminantInstances[className.name] === undefined || this.context.resolvedPerminantInstances[className.name] === null) {
                this.context.resolvedPerminantInstances[className.name] = new className(...params);
            }
            return this.context.resolvedPerminantInstances[className.name];
        }
        else {
            if (this.context.resolvedInstances[className.name] === undefined || this.context.resolvedInstances[className.name] === null) {
                this.context.resolvedInstances[className.name] = new className(...params);
            }
            return this.context.resolvedInstances[className.name];
        }
    }
}
exports.DI = DI;
