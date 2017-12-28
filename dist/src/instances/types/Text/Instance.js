"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const Instance_1 = require("../Instance");
class TextInstance extends Instance_1.default {
    constructor(abstractElement, parentInstance, previousAbstractSiblingCount) {
        super(abstractElement, parentInstance, previousAbstractSiblingCount);
        this.type = types_1.default.Text;
        this.ref = document.createTextNode(abstractElement);
        this.appendToParent(this.ref, previousAbstractSiblingCount());
    }
    /**
     * textnode is always a length of one
     */
    getLength() {
        return 1;
    }
    setText(abstractElement) {
        this.ref.textContent = abstractElement;
        return this;
    }
    /**
     * removes this textnode from the dom
     */
    remove() {
        this.ref.remove();
        return this;
    }
}
exports.default = TextInstance;
//# sourceMappingURL=Instance.js.map