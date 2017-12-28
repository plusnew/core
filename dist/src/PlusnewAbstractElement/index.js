"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlusnewAbstractElement {
    /**
     * Lightweight representation of a DOM or Component Node, this component is immutable and is used for comparison
     */
    constructor(type, props, children) {
        this.setType(type)
            .setProps(props, children);
    }
    /**
     * sets the information what domnode or component this is
     */
    setType(type) {
        this.type = type;
        return this;
    }
    /**
     * sets the props given from the parent
     */
    setProps(props, children) {
        if (props) {
            this.props = Object.assign({}, props, { children }); // Spread is used to remove reference
        }
        else {
            this.props = { children };
        }
        return this;
    }
    /**
     * Checks if the key is a custom element and checks for vulnerable values
     */
    shouldAddPropToElement(key) {
        return key !== 'children'; // @TODO add ref/key
    }
}
exports.default = PlusnewAbstractElement;
//# sourceMappingURL=index.js.map