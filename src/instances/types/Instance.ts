import { ApplicationElement, props } from '../../interfaces/component';
import { PlusnewElement } from '../../PlusnewAbstractElement';
import types from './types';

export default abstract class Instance {
  public nodeType: types;
  public parentInstance?: Instance;
  public type: PlusnewElement;
  public props: ApplicationElement | props;
  public previousAbstractSiblingCount: () => number;
  public namespace?: string;
  public createChildrenComponents = true;

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance | undefined,
    previousAbstractSiblingCount: () => number,
  ) {
    this.parentInstance = parentInstance;
    this.previousAbstractSiblingCount = previousAbstractSiblingCount;
    if (this.parentInstance) {
      this.namespace = this.parentInstance.namespace;
      this.createChildrenComponents = this.parentInstance.createChildrenComponents;
    }
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
  }

  /**
   * how many dom elements does this instance have
   */
  public abstract getLength(): number;

  /**
   * orders to move itself to another place
   */
  public abstract move(position: number): void;

  /**
   * orders to remove itself from the dom
   */
  public abstract remove(): void;

  /**
   * gets called with newly created elements by the children
   */
  public abstract elementDidMount(element: Element): void;

  /**
   * gets called with deleted elements from the children
   */
  public abstract elementWillUnmount(element: Element): void | Promise<any>;

  /**
   * orders to remove itself from the dom
   */
  public abstract reconcile(newAbstractElement: ApplicationElement): void;
}
