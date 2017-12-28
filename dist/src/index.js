"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlusnewAbstractElement_1 = require("PlusnewAbstractElement");
const factory_1 = require("instances/factory");
const Instance_1 = require("instances/types/Root/Instance");
class Plusnew {
    /**
     * creates lightweight representation of DOM or ComponentNodes
     */
    createElement(type, props, ...children) {
        return new PlusnewAbstractElement_1.default(type, props, children);
    }
    /**
     * mounts the root component
     */
    render(component, containerElement) {
        // Fake RootInstance
        const wrapper = new Instance_1.default(new PlusnewAbstractElement_1.default(component, {}, []), undefined, () => 0);
        wrapper.ref = containerElement;
        while (containerElement.childNodes.length) {
            containerElement.removeChild(containerElement.childNodes[0]);
        }
        return factory_1.default(new PlusnewAbstractElement_1.default(component, {}, []), wrapper, () => 0);
    }
}
exports.default = Plusnew;
//# sourceMappingURL=index.js.map