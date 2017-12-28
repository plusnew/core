"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("index");
const redchain_1 = require("redchain");
describe('rendering nested components', () => {
    let plusnew;
    let container;
    beforeEach(() => {
        plusnew = new index_1.default();
        container = document.createElement('div');
        container.innerHTML = 'lots of stuff';
        document.body.appendChild(container);
    });
    it('does a initial list work, with pushing values', () => {
        const local = redchain_1.default(() => 'foo', (state, newValue) => newValue);
        const change = jasmine.createSpy('change', () => {
            local.dispatch('bar');
        });
        const component = () => {
            return {
                render: () => plusnew.createElement("input", { onchange: change, value: local.state }),
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
        const input = document.getElementsByTagName('input')[0];
        input.value = 'bar';
        const event = new CustomEvent('input', { detail: { target: input } });
        input.dispatchEvent(event);
        expect(change.calls.count()).toEqual(1);
        expect(change).toHaveBeenCalledWith(event);
    });
});
//# sourceMappingURL=input.spec.js.map