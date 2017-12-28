import { ApplicationElement } from 'interfaces/component';
import types from './types';
export default abstract class Instance {
    type: types;
    parentInstance?: Instance;
    abstractElement: ApplicationElement;
    previousAbstractSiblingCount: () => number;
    constructor(abstractElement: ApplicationElement, parentInstance: Instance | undefined, previousAbstractSiblingCount: () => number);
    /**
     * appends the given element, to the parentinstance, if existent
     */
    appendToParent(element: Node, index: number): this;
    /**
     * makes a insertBefore to the parent
     */
    appendChild(element: Node, index: number): this;
    /**
     * how many dom elements does this instance have
     */
    abstract getLength(): number;
    /**
     * orders to remove itself from the dom
     */
    abstract remove(): Instance;
}
