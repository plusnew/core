import PlusnewAbstractElement from 'PlusnewAbstractElement';
import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
export default class DomInstance extends ChildrenInstance {
    type: types;
    abstractElement: PlusnewAbstractElement;
    ref: HTMLElement;
    constructor(abstractElement: PlusnewAbstractElement, parentInstance: Instance, previousAbstractSiblingCount: () => number);
    /**
     * sets the attributes to the element
     */
    private setProps();
    /**
     * sets a property
     */
    setProp(key: string, value: any): this;
    private setOnChangeEvent(callback);
    private setNormalProp(key, value);
    /**
     * domnode is always a length of one
     */
    getLength(): number;
    /**
     * by the children should add themselfs to our element
     */
    appendChild(element: Node): this;
    /**
     * removes the domnode from the parent
     */
    remove(): this;
}
