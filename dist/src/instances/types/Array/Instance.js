"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const ChildrenInstance_1 = require("../ChildrenInstance");
class ArrayInstance extends ChildrenInstance_1.default {
    constructor(abstractElements, parentInstance, previousAbstractSiblingCount) {
        super(abstractElements, parentInstance, previousAbstractSiblingCount);
        this.type = types_1.default.Array;
        this.addChildren(abstractElements);
    }
}
exports.default = ArrayInstance;
//# sourceMappingURL=Instance.js.map