import { ApplicationElement } from 'interfaces/component';
import Instance from './Instance';
export default abstract class ChildrenInstance extends Instance {
    children: Instance[];
    constructor(abstractElement: ApplicationElement, parentInstance: Instance, previousAbstractSiblingCount: () => number);
    /**
     * calculates the previous siblinglength
     */
    getPreviousLength(instanceIndex: number): number;
    addChildren(children: ApplicationElement[]): void;
    /**
     * the length is dependent on the amount of array entities
     */
    getLength(): number;
    /**
     * removes the children from the dom
     */
    remove(): this;
}
