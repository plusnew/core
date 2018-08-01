import { ApplicationElement, props } from '../../interfaces/component';
import { PlusnewElement } from '../../PlusnewAbstractElement';
import types from './types';
import { storeType } from '../../util/store';

export type predecessor = Node | null;
export type getPredeccessor = () => predecessor;

export default abstract class Instance {
  public nodeType: types;
  public parentInstance?: Instance;
  public type: PlusnewElement;
  public props: ApplicationElement | props | storeType<Partial<props>, Partial<props>>;
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
  }

  public insertBefore(parentNode: Node, target: Node, predecessor: predecessor) {
    if (predecessor === null) {
      parentNode.insertBefore(target, parentNode.firstChild);
    } else {
      parentNode.insertBefore(target, predecessor.nextSibling);
    }
  }

  public abstract getLastIntrinsicElement(): Node | null;

  /**
   * orders to move itself to another place
   */

  public abstract move(predecessor: predecessor): void;

  public abstract remove(prepareRemoveSelf: boolean): Promise<any> | void;

  /**
   * gets called with newly created elements by the children
   */
  public elementDidMount(element: Element): Promise<any> | void {
    if (this.parentInstance) {
      this.parentInstance.elementDidMount(element);
    }
  }

  /**
   * gets called with deleted elements from the children
   */
  public elementWillUnmount(element: Element): Promise<any> | void {
    if (this.parentInstance) {
      return this.parentInstance.elementWillUnmount(element);
    }
  }

  /**
   * orders to remove itself from the dom
   */
  public abstract reconcile(newAbstractElement: ApplicationElement): void;
}
