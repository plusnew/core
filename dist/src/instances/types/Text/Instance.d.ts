import types from '../types';
import Instance from '../Instance';
export default class TextInstance extends Instance {
    type: types;
    abstractElement: string;
    ref: Text;
    constructor(abstractElement: string, parentInstance: Instance, previousAbstractSiblingCount: () => number);
    /**
     * textnode is always a length of one
     */
    getLength(): number;
    setText(abstractElement: string): this;
    /**
     * removes this textnode from the dom
     */
    remove(): this;
}
