"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reconciler_1 = require("../../reconciler");
function default_1(newAbstractElement, instance) {
    for (const propIndex in newAbstractElement.props) {
        if (propIndex === 'children') {
            for (let i = 0; i < newAbstractElement.props.children.length; i += 1) {
                const newInstance = reconciler_1.default.update(newAbstractElement.props.children[i], instance.children[i]);
                if (newInstance !== instance.children[i]) {
                    instance.children[i].remove();
                    instance.children[i] = newInstance;
                }
            }
        }
        else if (propIndex !== 'children') {
            if (instance.abstractElement.props[propIndex] !== newAbstractElement.props[propIndex]) {
                instance.setProp(propIndex, newAbstractElement.props[propIndex]);
            }
        }
    }
    instance.abstractElement = newAbstractElement; // updating the shadowdom
}
exports.default = default_1;
//# sourceMappingURL=reconcile.js.map