import { ApplicationElement, props } from '../../interfaces/component';
import { PlusnewElement } from '../../PlusnewAbstractElement';
import types from './types';

export type successor = Node | null;
export type getSuccessor = () => successor;

export default abstract class Instance {
  public nodeType: types;
  public parentInstance?: Instance;
  public type: PlusnewElement;
  public props: ApplicationElement | props;
  public getSuccessor: getSuccessor;
  public namespace?: string;
  public createChildrenComponents = true;

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance | undefined,
    getSuccessor: getSuccessor,
  ) {
    this.parentInstance = parentInstance;
    this.getSuccessor = getSuccessor;
    if (this.parentInstance) {
      this.namespace = this.parentInstance.namespace;
      this.createChildrenComponents = this.parentInstance.createChildrenComponents;
    }
  }

  /**
   * appends the given element, to the parentinstance, if existent
   */
  public appendToParent(element: Node, successor: successor) {
    if (this.parentInstance === undefined) {
      throw new Error('Cant append element to not existing parent');
    } else {
      this.parentInstance.appendChild(element, successor);
    }

    return this;
  }

  /**
   * makes a insertBefore to the parent
   */
  public appendChild(element: Node, successor: successor) {
    if (this.parentInstance === undefined) {
      throw new Error('Couldn\'t add child to parent');
    } else {
      this.parentInstance.appendChild(element, successor);
    }

    return this;
  }

  public abstract getFirstIntrinsicElement(): Node | null;

  /**
   * orders to move itself to another place
   */
  public abstract move(successor: successor): Instance;

  /**
   * orders to remove itself from the dom
   */
  public abstract remove(): Instance;

  /**
   * orders to remove itself from the dom
   */
  public abstract reconcile(newAbstractElement: ApplicationElement): Instance;
}
