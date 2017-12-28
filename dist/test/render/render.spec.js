"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("index");
describe('rendering the elements', () => {
    let plusnew;
    let container;
    beforeEach(() => {
        plusnew = new index_1.default();
        container = document.createElement('div');
        container.innerHTML = 'lots of stuff';
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.removeChild(container);
    });
    it('check if element is inserted', () => {
        const component = () => {
            return {
                render: () => plusnew.createElement("div", { className: "foo" }),
                dependencies: {},
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.className).toBe('foo');
    });
    it('check if elements are inserted', () => {
        const component = () => {
            return {
                render: () => [
                    plusnew.createElement("div", { className: "foo" }),
                    plusnew.createElement("span", { className: "bar" }),
                ],
                dependencies: {},
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(2);
        const firstTarget = container.childNodes[0];
        expect(firstTarget.nodeName).toBe('DIV');
        expect(firstTarget.className).toBe('foo');
        const secondTarget = container.childNodes[1];
        expect(secondTarget.nodeName).toBe('SPAN');
        expect(secondTarget.className).toBe('bar');
    });
    it('check if nesting works', () => {
        const component = () => {
            return {
                render: () => plusnew.createElement("div", { className: "foo" },
                    plusnew.createElement("span", { className: "bar" })),
                dependencies: {},
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.className).toBe('foo');
        expect(target.innerHTML).toBe('<span class="bar"></span>');
    });
    it('check if textnode is created', () => {
        const component = () => {
            return {
                render: () => plusnew.createElement("div", { className: "foo" }, "bar"),
                dependencies: {},
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(1);
        const target = container.childNodes[0];
        expect(target.nodeName).toBe('DIV');
        expect(target.className).toBe('foo');
        expect(target.innerHTML).toBe('bar');
    });
    it('check if textnode is created on root', () => {
        const component = () => {
            return {
                render: () => 'foo',
                dependencies: {},
            };
        };
        plusnew.render(component, container);
        expect(container.childNodes.length).toBe(1);
        expect(container.innerHTML).toBe('foo');
    });
});
//# sourceMappingURL=render.spec.js.map