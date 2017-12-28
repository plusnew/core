"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Instance_1 = require("./types/Array/Instance");
const Instance_2 = require("./types/Dom/Instance");
const Instance_3 = require("./types/Component/Instance");
const Instance_4 = require("./types/Text/Instance");
const elementTypeChecker_1 = require("util/elementTypeChecker");
/**
 * because data from jsx can be anything, this factory is needed to decide what type of instance should be created
 */
function default_1(abstractElement, parentInstance, previousAbstractSiblingCount) {
    if (elementTypeChecker_1.default.isTextElement(abstractElement) === true) {
        return new Instance_4.default(abstractElement, parentInstance, previousAbstractSiblingCount);
    }
    if (elementTypeChecker_1.default.isArrayElement(abstractElement) === true) {
        return new Instance_1.default(abstractElement, parentInstance, previousAbstractSiblingCount);
    }
    if (elementTypeChecker_1.default.isDomElement(abstractElement) === true) {
        return new Instance_2.default(abstractElement, parentInstance, previousAbstractSiblingCount);
    }
    if (elementTypeChecker_1.default.isComponentElement(abstractElement)) {
        return new Instance_3.default(abstractElement, parentInstance, previousAbstractSiblingCount);
    }
    throw new Error('Factory couldn\'t create unknown element type');
}
exports.default = default_1;
//# sourceMappingURL=factory.js.map