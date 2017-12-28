"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redchain_1 = require("redchain");
const index_1 = require("index");
describe('rendering nested components', () => {
    let plusnew;
    let container;
    beforeEach(() => {
        plusnew = new index_1.default();
        container = document.createElement('div');
        container.innerHTML = 'lots of stuff';
        document.body.appendChild(container);
    });
    it('checks if nesting the components works', () => {
        const NestedComponent = () => {
            return {
                render: (props) => plusnew.createElement("div", { className: props.value }, props.value),
                dependencies: {},
            };
        };
        const local = redchain_1.default(() => 'foo', (state, newValue) => newValue);
        const MainComponent = () => {
            return {
                render: () => plusnew.createElement(NestedComponent, { value: local.state }),
                dependencies: { local },
            };
        };
        plusnew.render(MainComponent, container);
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        const textElement = target.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.className).toBe('foo');
        expect(target.innerHTML).toBe('foo');
        expect(textElement.textContent).toBe('foo');
        local.dispatch('bar');
        expect(target.className).toBe('bar');
        expect(target.innerHTML).toBe('bar');
        expect(textElement).toBe(textElement);
    });
});
//# sourceMappingURL=component.spec.js.map