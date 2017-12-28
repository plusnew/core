import types from '../types';
import Instance from '../Instance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
import { props, deps, componentResult } from 'interfaces/component';
export default class ComponentInstance extends Instance {
    type: types;
    abstractElement: PlusnewAbstractElement;
    children: Instance;
    componentResult: componentResult<props, deps>;
    private dirty;
    constructor(abstractElement: PlusnewAbstractElement, parentInstance: Instance, previousAbstractSiblingCount: () => number);
    /**
     * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
     */
    private initialiseComponent();
    /**
     * asks the component what should be changed and puts it to the factory
     */
    private handleChildren();
    /**
     * sets the component to a state where it needs a rerender
     */
    setDirty(): this;
    /**
     * when the dirtyflag is set, unsets the dirtyflag and rerenders and informs the domhandler
     */
    private update();
    getLength(): number;
    /**
     * removes the children from the dom
     */
    remove(): this;
}
