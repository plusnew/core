"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The different types of Instances: document.createElement, new ComponentHandler(), document.createTextNode
 */
var InstanceTypes;
(function (InstanceTypes) {
    InstanceTypes[InstanceTypes["Dom"] = 0] = "Dom";
    InstanceTypes[InstanceTypes["Array"] = 1] = "Array";
    InstanceTypes[InstanceTypes["Text"] = 2] = "Text";
    InstanceTypes[InstanceTypes["Component"] = 3] = "Component";
    InstanceTypes[InstanceTypes["Root"] = 4] = "Root";
})(InstanceTypes || (InstanceTypes = {}));
exports.default = InstanceTypes;
//# sourceMappingURL=types.js.map