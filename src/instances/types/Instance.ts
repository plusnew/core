import { ApplicationElement } from '../../interfaces/component';
import types from './types';

export default abstract class Instance {
  public type: types;
  public parentInstance?: Instance;
  public abstractElement: ApplicationElement;
  public previousAbstractSiblingCount: () => number;

  constructor(abstractElement: ApplicationElement, parentInstance: Instance | undefined, previousAbstractSiblingCount: () => number) {
    this.abstractElement = abstractElement;
    this.parentInstance = parentInstance;
    this.previousAbstractSiblingCount = previousAbstractSiblingCount;
  }

  /**
   * appends the given element, to the parentinstance, if existent
   */
  public appendToParent(element: Node, index: number) {
    if (this.parentInstance === undefined) {
      throw new Error('Cant append element to not existing parent');
    } else {
      this.parentInstance.appendChild(element, index);
    }

    return this;
  }

  /**
   * makes a insertBefore to the parent
   */
  public appendChild(element: Node, index: number) {
    if (this.parentInstance === undefined) {
      throw new Error('Couldn\'t add child to parent');
    } else {
      this.parentInstance.appendChild(element, index);
    }

    return this;
  }

  /**
   * how many dom elements does this instance have
   */
  public abstract getLength(): number;

  /**
   * orders to move itself to another place
   */
  public abstract move(position: number): Instance;

  /**
   * orders to remove itself from the dom
   */
  public abstract remove(): Instance;

}
