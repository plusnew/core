"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redchain_1 = require("redchain");
const index_1 = require("index");
describe('rendering the elements', () => {
    let plusnew;
    let container;
    let local;
    beforeEach(() => {
        local = redchain_1.default(() => 'foo', (previousState, newValue) => newValue);
        plusnew = new index_1.default();
        container = document.createElement('div');
        container.innerHTML = 'lots of stuff';
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.removeChild(container);
    });
    it('does a value change with store', () => {
        const component = () => {
            return {
                render: () => plusnew.createElement("div", { className: local.state }, local.state),
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
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
    it('with the same values, all objects should be the same', () => {
        const component = () => {
            return {
                render: () => plusnew.createElement("div", { className: local.state }, local.state),
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        const textElement = target.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.className).toBe('foo');
        expect(textElement.textContent).toBe('foo');
        local.dispatch('foo');
        expect(target.className).toBe('foo');
        expect(target.innerHTML).toBe('foo');
        expect(textElement).toBe(textElement);
    });
    it('does a value change with store with JSX.Element to string', () => {
        const component = () => {
            return {
                render: () => local.state === 'foo' ? plusnew.createElement("div", null, local.state) : local.state,
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.innerHTML).toBe('foo');
        local.dispatch('bar');
        expect(container.innerHTML).toBe('bar');
    });
    it('does a value change with store with string to JSX.Element', () => {
        const component = () => {
            return {
                render: () => local.state === 'foo' ? local.state : plusnew.createElement("div", null, local.state),
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
        expect(container.innerHTML).toBe('foo');
        local.dispatch('bar');
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.innerHTML).toBe('bar');
    });
    it('does a value change with store with string to JSX.Element[]', () => {
        const component = () => {
            return {
                render: () => local.state === 'foo' ? local.state : [plusnew.createElement("div", null, local.state), plusnew.createElement("span", null, local.state)],
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
        expect(container.innerHTML).toBe('foo');
        local.dispatch('bar');
        expect(container.childNodes.length).toBe(2);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.innerHTML).toBe('bar');
        const targetSecond = container.childNodes[1];
        expect(targetSecond.nodeName).toBe('SPAN');
        expect(targetSecond.innerHTML).toBe('bar');
    });
    it('does a value change with store with JSX.Element[] to string', () => {
        const component = () => {
            return {
                render: () => local.state === 'foo' ? [plusnew.createElement("div", null, local.state), plusnew.createElement("span", null, local.state)] : local.state,
                dependencies: { local },
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(2);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.innerHTML).toBe('foo');
        const targetSecond = container.childNodes[1];
        expect(targetSecond.nodeName).toBe('SPAN');
        expect(targetSecond.innerHTML).toBe('foo');
        local.dispatch('bar');
        expect(container.innerHTML).toBe('bar');
    });
});
//# sourceMappingURL=update.spec.js.map