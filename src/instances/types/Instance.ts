import { ApplicationElement, props } from '../../interfaces/component';
import { PlusnewElement } from '../../PlusnewAbstractElement';
import types from './types';

export type predecessor = Node | null;
export type getPredeccessor = () => predecessor;

export default abstract class Instance {
  public nodeType: types;
  public parentInstance?: Instance;
  public type: PlusnewElement;
  public props: ApplicationElement | props;
  public getPredecessor: getPredeccessor;
  public namespace?: string;
  public createChildrenComponents = true;

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance | undefined,
    getPredecessor: getPredeccessor,
  ) {
    this.parentInstance = parentInstance;
    this.getPredecessor = getPredecessor;
    if (this.parentInstance) {
      this.namespace = this.parentInstance.namespace;
      this.createChildrenComponents = this.parentInstance.createChildrenComponents;
    }
  }

  /**
   * appends the given element, to the parentinstance, if existent
   */
  public appendToParent(element: Node, predecessor: predecessor) {
    if (this.parentInstance === undefined) {
      throw new Error('Cant append element to not existing parent');
    } else {
      this.parentInstance.appendChild(element, predecessor);
    }

    return this;
  }

  /**
   * makes a insertBefore to the parent
   */
  public appendChild(element: Node, predecessor: predecessor) {
    if (this.parentInstance === undefined) {
      throw new Error('Couldn\'t add child to parent');
    } else {
      this.parentInstance.appendChild(element, predecessor);
    }

    return this;
  }

  public abstract getLastIntrinsicElement(): Node | null;

  /**
   * orders to move itself to another place
   */
  public abstract move(predecessor: predecessor): Instance;

  /**
   * orders to remove itself from the dom
   */
  public abstract remove(): Instance;

  /**
   * orders to remove itself from the dom
   */
  public abstract reconcile(newAbstractElement: ApplicationElement): Instance;
}
