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
    it('does a initial list work, with pushing values', () => {
        const list = ['first', 'second', 'third'];
        const dependencies = {
            local: redchain_1.default(() => list, (state, newValue) => [...state, newValue]),
        };
        const MainComponent = () => {
            return {
                dependencies,
                render: (props, { local }) => plusnew.createElement("ul", null, local.state.map((value, index) => plusnew.createElement("li", { key: index }, value))),
            };
        };
        plusnew.render(MainComponent, container);
        const ul = container.childNodes[0];
        expect(container.childNodes.length).toBe(1);
        expect(ul.tagName).toBe('UL');
        expect(ul.childNodes.length).toBe(3);
        ul.childNodes.forEach((li, index) => {
            expect(li.tagName).toBe('LI');
            expect(li.innerHTML).toBe(list[index]);
        });
    });
    it('does a initial list work, with pushing values', () => {
        const list = ['first', 'second', 'third'];
        const dependencies = {
            local: redchain_1.default(() => list, (state, newValue) => [...state, newValue]),
        };
        const MainComponent = () => {
            return {
                dependencies,
                render: (props, { local }) => plusnew.createElement("ul", null,
                    local.state.map((value, index) => plusnew.createElement("li", { key: index }, value)),
                    plusnew.createElement("li", null, "foo")),
            };
        };
        plusnew.render(MainComponent, container);
        const ul = container.childNodes[0];
        expect(container.childNodes.length).toBe(1);
        expect(ul.tagName).toBe('UL');
        expect(ul.childNodes.length).toBe(4);
        ul.childNodes.forEach((li, index) => {
            expect(li.tagName).toBe('LI');
            if (index === 3) {
                expect(li.innerHTML).toBe('foo');
            }
            else {
                expect(li.innerHTML).toBe(list[index]);
            }
        });
    });
});
//# sourceMappingURL=array.spec.js.map