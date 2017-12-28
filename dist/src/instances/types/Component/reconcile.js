"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reconciler_1 = require("../../reconciler");
function default_1(newAbstractElement, instance) {
    const newAbstractChildren = instance.componentResult.render(newAbstractElement.props, instance.componentResult.dependencies);
    const newChildrenInstance = reconciler_1.default.update(newAbstractChildren, instance.children);
    if (newChildrenInstance !== instance.children) {
        instance.children.remove();
        instance.children = newChildrenInstance;
    }
}
exports.default = default_1;
//# sourceMappingURL=reconcile.js.map