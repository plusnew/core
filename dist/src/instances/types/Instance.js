"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instance {
    constructor(abstractElement, parentInstance, previousAbstractSiblingCount) {
        this.abstractElement = abstractElement;
        this.parentInstance = parentInstance;
        this.previousAbstractSiblingCount = previousAbstractSiblingCount;
    }
    /**
     * appends the given element, to the parentinstance, if existent
     */
    appendToParent(element, index) {
        if (this.parentInstance === undefined) {
            throw new Error('Cant append element to not existing parent');
        }
        else {
            this.parentInstance.appendChild(element, index);
        }
        return this;
    }
    /**
     * makes a insertBefore to the parent
     */
    appendChild(element, index) {
        if (this.parentInstance === undefined) {
            throw new Error('Couldn\'t add child to parent');
        }
        else {
            this.parentInstance.appendChild(element, index);
        }
        return this;
    }
}
exports.default = Instance;
//# sourceMappingURL=Instance.js.map