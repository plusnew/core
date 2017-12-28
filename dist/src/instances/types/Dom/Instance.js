"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const ChildrenInstance_1 = require("../ChildrenInstance");
class DomInstance extends ChildrenInstance_1.default {
    constructor(abstractElement, parentInstance, previousAbstractSiblingCount) {
        super(abstractElement, parentInstance, previousAbstractSiblingCount);
        this.type = types_1.default.Dom;
        if (typeof (abstractElement.type) === 'string') {
            this.ref = document.createElement(abstractElement.type);
        }
        else {
            throw new Error('Could not createdom element with type not being a string');
        }
        this.setProps()
            .addChildren(abstractElement.props.children);
        this.appendToParent(this.ref, previousAbstractSiblingCount());
    }
    /**
     * sets the attributes to the element
     */
    setProps() {
        for (const index in this.abstractElement.props) {
            this.setProp(index, this.abstractElement.props[index]);
        }
        return this;
    }
    /**
     * sets a property
     */
    setProp(key, value) {
        if (this.abstractElement.shouldAddPropToElement(key) === true) {
            if (key === 'onchange') {
                this.setOnChangeEvent(value);
            }
            else {
                this.setNormalProp(key, value);
            }
        }
        return this;
    }
    setOnChangeEvent(callback) {
        // @TODO remove old eventlisteners
        this.ref.addEventListener('input', (evt) => {
            // let preventDefault = true;
            this.setNormalProp = (key, value) => {
                // if (key === 'value') {
                //   if (value === (evt.target as HTMLInputElement).value) {
                //   } else {
                //   }
                // } else {
                DomInstance.prototype.setNormalProp.call(this, key, value);
                // }
            };
            this.abstractElement.props.onchange(evt);
            delete this.setNormalProp;
        });
        return this;
    }
    setNormalProp(key, value) {
        this.ref[key] = value; // @TODO should probably be improved
    }
    /**
     * domnode is always a length of one
     */
    getLength() {
        return 1;
    }
    /**
     * by the children should add themselfs to our element
     */
    appendChild(element) {
        this.ref.appendChild(element);
        return this;
    }
    /**
     * removes the domnode from the parent
     */
    remove() {
        this.ref.parentNode.removeChild(this.ref);
        return this;
    }
}
exports.default = DomInstance;
//# sourceMappingURL=Instance.js.map