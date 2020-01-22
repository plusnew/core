import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import { props } from '../../../interfaces/component';
import ChildrenInstance from '../ChildrenInstance';
import Instance, { getPredeccessor, predecessor, HostInstance } from '../Instance';
import types from '../types';
import reconcile from './reconcile';
import { renderOptions } from '../../../interfaces/renderOptions';

/**
 * HostInstances are representations of <div />
 * or when plusnew.createElement gets called with a string
 * these can be html-elements but also svg elements
 * the HostInstance sets the attributes and properties in the dom
 * and takes care of EventHandlers
 *
 * it also fires events like elementDidMount and elementWillUnmount
 */
export default class DomInstance<HostElement, HostTextElement> extends ChildrenInstance<HostElement, HostTextElement> {
  public nodeType = types.Dom;
  public ref: HostElement;
  public props: props;
  public executeChildrenElementWillUnmount = false;
  public type: string;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance<HostElement, HostTextElement>,
    predecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>,
  ) {
    super(abstractElement, parentInstance, predecessor, renderOptions);
    this.type = `${abstractElement.type}`;
    this.props = abstractElement.props;

    this.ref = renderOptions.driver.element.create(this);

    this.setProps();
    this.appendToParent(this, predecessor());
  }

  initialiseNestedElements() {
    this.addChildren();
    // Autofocus call has to happen, after it got appended to parent, and after children are added
    // Some browsers ignore element.focus() when it is not yet added to the document
    this.renderOptions.driver.element.elementDidMountHook(this);
    this.elementDidMountToParent();
  }

  /**
   * this function gets called from the children, when a intrinsic-element gets created
   * this will not get proxied above, dom-instances stops the bubbling of such an event
   */
  public elementDidMount() {}

  /**
   * this function gets called from the children, when a intrinsic-element gets deleted
   * this will not get proxied above, dom-instances stops the bubbling of such an event
   */
  public elementWillUnmount() {}

  /**
   * this function gets called, to determine predecessors from siblings, since this is an actualdom element
   * the reference to self should be returned
   */
  public getLastIntrinsicInstance() {
    return this;
  }

  /**
   * for the children of this dom instance, there is no predecessor, because dom-instance is an actual element
   */
  public getChildrenPredeccessor() {
    return null;
  }

  /**
   * sets the attributes to the element
   */
  private setProps() {
    for (const index in this.props) {
      this.setProp(index, this.props[index]);
    }
  }

  /**
   * sets the actual property on the element
   */
  public setProp(key: string, value: any) {
    if (this.ignoreProperty(key) === false) {
      this.renderOptions.driver.element.setAttribute(
        this,
        key,
        value,
      );
    }
  }

  /**
   * some properties are plusnew-internally, these should not be set on the actual intrinsic-element
   */
  private ignoreProperty(key: string) {
    return (
      key === 'key' ||
      key === 'children'
    );
  }

  /**
   * deletes a property from dom element
   */
  public unsetProp(key: string) {
    this.renderOptions.driver.element.unsetAttribute(this, key);
  }

  /**
   * by the children should add themselfs to our element
   */

  public appendChild(childInstance: HostInstance<HostElement, HostTextElement>, predecessor: predecessor<HostElement, HostTextElement>) {
    this.renderOptions.driver.element.appendChildAfterSibling(this, childInstance, predecessor);
  }

  /**
   * moves the domnode to another place
   */
  public move(predecessor: predecessor<HostElement, HostTextElement>) {
    this.renderOptions.driver.element.moveAfterSibling(this, predecessor);
  }

  /**
   * calls the parentInstance that this module got created
   */
  public elementDidMountToParent() {
    (this.parentInstance as Instance<HostElement, HostTextElement>).elementDidMount(this.ref);
  }

  /**
   * calls the parentInstance that this module got deleted
   */
  public elementWillUnmountToParent() {
    return (this.parentInstance as Instance<HostElement, HostTextElement>).elementWillUnmount(this.ref);
  }

  /**
   * checks if parents want to do stuff with unmounting element, e.g. animate it
   */
  public prepareRemoveSelf() {
    return this.elementWillUnmountToParent();
  }

  /**
   * actually removes this element
   */
  public removeSelf() {
    this.renderOptions.driver.element.remove(this);
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    reconcile(newAbstractElement.props, this);
  }
}
