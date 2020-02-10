import { ApplicationElement, props } from '../../interfaces/component';
import { PlusnewElement } from '../../PlusnewAbstractElement';
import types from './types';
import { renderOptions } from '../../interfaces/renderOptions';
import DomInstance from './Host/Instance';
import TextInstance from './Text/Instance';

export type HostInstance<HostElement, HostTextElement> = DomInstance<HostElement, HostTextElement> | TextInstance<HostElement, HostTextElement>;
export type predecessor<HostElement, HostTextElement> = HostInstance<HostElement, HostTextElement> | null;
export type getPredeccessor<HostElement, HostTextElement> = () => predecessor<HostElement, HostTextElement>;

export default abstract class Instance<HostElement, HostTextElement> {
  abstract nodeType: types;
  abstract type: PlusnewElement;
  public parentInstance?: Instance<HostElement, HostTextElement>;
  public props: ApplicationElement | Partial<props>;
  public getPredecessor: getPredeccessor<HostElement, HostTextElement>;
  public renderOptions: renderOptions<HostElement, HostTextElement>;

  constructor(
    _abstractElement: ApplicationElement,
    parentInstance: Instance<HostElement, HostTextElement> | undefined,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>,
  ) {
    this.parentInstance = parentInstance;
    this.getPredecessor = getPredecessor;
    this.renderOptions = renderOptions;
  }

  /**
   * this will get called after constructor
   * so that the parent already has the reference to this instance
   *
   * is needed for dispatching while rendering
   */
  initialiseNestedElements() {}

  /**
   * appends the given element, to the parentinstance, if existent
   */
  public appendToParent(childInstance: HostInstance<HostElement, HostTextElement>, predecessor: predecessor<HostElement, HostTextElement>) {
    if (this.parentInstance === undefined) {
      throw new Error('Cant append element to not existing parent');
    } else {
      this.parentInstance.appendChild(childInstance, predecessor);
    }
  }

  /**
   * makes a insertBefore to the parent
   */
  public appendChild(element: HostInstance<HostElement, HostTextElement>, predecessor: predecessor<HostElement, HostTextElement>) {
    if (this.parentInstance === undefined) {
      throw new Error('Couldn\'t add child to parent');
    } else {
      this.parentInstance.appendChild(element, predecessor);
    }
  }

  findParent(callback: (instance: Instance<HostElement, HostTextElement>) => boolean): Instance<HostElement, HostTextElement> | undefined {
    return (this.parentInstance as Instance<HostElement, HostTextElement>).find(callback);
  }

  /**
   * recursively search for another instance
   */
  public find(callback: (instance: Instance<HostElement, HostTextElement>) => boolean): Instance<HostElement, HostTextElement> | undefined {
    if (callback(this)) {
      return this;
    }

    if (this.parentInstance) {
      return this.parentInstance.find(callback);
    }

    return undefined;
  }

  public abstract getLastIntrinsicInstance(): HostInstance<HostElement, HostTextElement> | TextInstance<HostElement, HostTextElement> | null;

  /**
   * orders to move itself to another place
   */

  public abstract move(predecessor: predecessor<HostElement, HostTextElement>): void;

  public abstract remove(prepareRemoveSelf: boolean): Promise<any> | void;

  /**
   * gets called with newly created elements by the children
   */
  public elementDidMount(element: HostElement | HostTextElement): Promise<any> | void {
    if (this.parentInstance) {
      this.parentInstance.elementDidMount(element);
    }
  }

  /**
   * gets called with deleted elements from the children
   */
  public elementWillUnmount(element: HostElement | HostTextElement): Promise<any> | void {
    if (this.parentInstance) {
      return this.parentInstance.elementWillUnmount(element);
    }
  }

  /**
   * orders to remove itself from the dom
   */
  public abstract reconcile(newAbstractElement: ApplicationElement): void;
}
