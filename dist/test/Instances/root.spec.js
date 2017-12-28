"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Instance_1 = require("instances/types/Root/Instance");
describe('Does the root-instance behave correctly', () => {
    let root;
    beforeEach(() => {
        root = new Instance_1.default('foo', undefined, () => 0);
    });
    it('getLength should throw exception', () => {
        expect(() => root.getLength()).toThrow(new Error('getLength of RootElement is irrelevant'));
    });
    it('remove should throw exception', () => {
        expect(() => root.remove()).toThrow(new Error('The root element can\'t remove itself'));
    });
});
//# sourceMappingURL=root.spec.js.map