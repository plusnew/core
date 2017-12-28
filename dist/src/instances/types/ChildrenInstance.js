"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Instance_1 = require("./Instance");
const factory_1 = require("../factory");
class ChildrenInstance extends Instance_1.default {
    constructor(abstractElement, parentInstance, previousAbstractSiblingCount) {
        super(abstractElement, parentInstance, previousAbstractSiblingCount);
        this.children = [];
    }
    /**
     * calculates the previous siblinglength
     */
    getPreviousLength(instanceIndex) {
        let previousCount = this.previousAbstractSiblingCount();
        for (let i = 0; i < instanceIndex; i += 1) {
            previousCount += this.children[i].getLength();
        }
        return previousCount;
    }
    addChildren(children) {
        for (let i = 0; i < children.length; i += 1) {
            this.children.push(factory_1.default(children[i], this, this.getPreviousLength.bind(this, i)));
        }
    }
    /**
     * the length is dependent on the amount of array entities
     */
    getLength() {
        let length = 0;
        for (let i = 0; i < this.children.length; i += 1) {
            length += this.children[i].getLength();
        }
        return length;
    }
    /**
     * removes the children from the dom
     */
    remove() {
        this.children.forEach(child => child.remove());
        return this;
    }
}
exports.default = ChildrenInstance;
//# sourceMappingURL=ChildrenInstance.js.map