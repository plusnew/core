"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const Instance_1 = require("../Instance");
class RootInstance extends Instance_1.default {
    constructor() {
        super(...arguments);
        this.type = types_1.default.Root;
    }
    /**
     * appends the element to the rootcontainer
     */
    appendChild(element) {
        this.ref.appendChild(element);
        return this;
    }
    /**
     * Root is no child of nobody, because of that nobody should care how long it is
     */
    getLength() {
        throw new Error('getLength of RootElement is irrelevant');
    }
    /**
     * Nobody is above the root, and because of that nobody is able to remove the root
     */
    remove() {
        throw new Error('The root element can\'t remove itself');
    }
}
exports.default = RootInstance;
//# sourceMappingURL=Instance.js.map