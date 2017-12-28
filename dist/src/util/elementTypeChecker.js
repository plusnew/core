"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementTypeChecker {
    isTextElement(abstractElement) {
        return typeof (abstractElement) === 'string';
    }
    isArrayElement(abstractElement) {
        return Array.isArray(abstractElement);
    }
    isDomElement(abstractElement) {
        if (this.isArrayElement(abstractElement) === false && this.isTextElement(abstractElement) === false) {
            return typeof (abstractElement.type) === 'string';
        }
        return false;
    }
    isComponentElement(abstractElement) {
        if (this.isArrayElement(abstractElement) === false && this.isTextElement(abstractElement) === false) {
            return typeof (abstractElement.type) !== 'string';
        }
        return false;
    }
}
exports.default = new ElementTypeChecker();
//# sourceMappingURL=elementTypeChecker.js.map