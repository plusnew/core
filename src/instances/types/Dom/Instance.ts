import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import { getSpecialNamespace } from '../../../util/namespace';

const PropToAttribbuteMapping = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
};

export default class DomInstance extends ChildrenInstance {
  public type = types.Dom;
  public abstractElement: PlusnewAbstractElement;
  public ref: Element;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.setNamespace();

    if (this.namespace) {
      this.ref = document.createElementNS(this.namespace, abstractElement.type as string);
    } else {
      this.ref = document.createElement(abstractElement.type as string);
    }

    this.setProps().addChildren(abstractElement.props.children);

    this.appendToParent(this.ref, previousAbstractSiblingCount());
  }

  private setNamespace() {
    this.namespace = getSpecialNamespace(this.abstractElement.type as string) || this.namespace;
  }

  /**
   * Dom is its own element, children siblingcount start by 0
   */
  public getPreviousSiblingsForChildren() {
    return 0;
  }

  /**
   * sets the attributes to the element
   */
  private setProps() {
    for (const index in this.abstractElement.props) {
      this.setProp(index, this.abstractElement.props[index]);
    }

    return this;
  }

  /**
   * sets a property
   */
  public setProp(key: string, value: any) {
    if (this.abstractElement.shouldAddPropToElement(key) === true) {
      if (key === 'onchange') {
        this.setOnChangeEvent(value);
      } else {
        this.setNormalProp(key, value);
      }
    }

    return this;
  }

  private setOnChangeEvent(callback: (evt: Event) => void) {
    (this.ref as HTMLElement).oninput = (evt: Event) => {
      let preventDefault = true;
      this.setNormalProp = (key, value) => {
        if ((evt.target as HTMLInputElement).value === value) {
          preventDefault = false;

        } else {
          DomInstance.prototype.setNormalProp.call(this, key, value);
          preventDefault = true;
        }

        return this;
      };
      this.abstractElement.props.onchange(evt);

      if (preventDefault === true) {
        (this.ref as HTMLInputElement).value = this.abstractElement.props.value;
      }
      delete this.setNormalProp;
    };

    return this;
  }

  private isInternalPlusnewProp(key: string) {
    return key === 'key';
  }

  /**
   * sets the actual property on the element
   */
  private setNormalProp(key: string, value: any) {
    const keyName = this.getAttributeNameFromProp(key);
    if (this.isInternalPlusnewProp(key)) {
      // When its an internal property, it should not be set to dom element
    } else if (typeof value === 'function') {
      (this.ref as any)[keyName] = value;
    } else if (typeof(value) === 'boolean') {
      if (value === true) {
        // The standard says, that boolean attributes should have the keyname as the value
        this.ref.setAttribute(keyName, keyName);
      } else {
        // boolean attributes have to be removed, to be invalidated
        this.ref.removeAttribute(keyName);
      }
    } else {
      if (key === 'style') {
        // style gets set as a attribute, not by property
        // because of better debuggability when set by this way
        // When an invalid property gets set, the browser just sucks it up and ignores it without errors
        this.ref.setAttribute(keyName, this.getStylePropsAsAttribute(value));
      } else {
        // All the other attributes are strings
        this.ref.setAttribute(keyName, value + '');
      }
    }

    return this;
  }


  /**
   * deletes a property from dom element
   */
  public unsetProp(key: string) {
    const keyName = this.getAttributeNameFromProp(key);

    if (typeof (this.ref as any)[keyName] === 'function') {
      (this.ref as any)[keyName] = null;
    } else {
      this.ref.removeAttribute(this.getAttributeNameFromProp(key));
    }
    return this;
  }

  /**
   * sets all the style attributes
   */
  getStylePropsAsAttribute(style: {[styleIndex: string]: string}): string {
    return Object.keys(style).reduce((styleString, styleIndex) => `${styleString}${styleIndex}:${style[styleIndex]};`, '');
  }

  /**
   * gets the correct attributename, className gets to class etc
   */
  private getAttributeNameFromProp(key: string): string {
    if (PropToAttribbuteMapping.hasOwnProperty(key)) {
      return (PropToAttribbuteMapping as any)[key];
    }
    return key.toLowerCase();
  }

  /**
   * domnode is always a length of one
   */
  public getLength() {
    return 1;
  }

  /**
   * by the children should add themselfs to our element
   */
  public appendChild(element: Node, index: number) {
    this.ref.insertBefore(element, this.ref.childNodes[index]);

    return this;
  }

  /**
   * moves the domnode from the parent
   */
  public move(position: number) {
    const parentNode = this.ref.parentNode as Node;
    parentNode.insertBefore(this.ref, parentNode.childNodes[position]);

    return this;
  }

  /**
   * removes the domnode from the parent
   */
  public remove() {
    this.children.forEach(child => child.remove());
    (this.ref.parentNode as Node).removeChild(this.ref);

    return this;
  }
}
