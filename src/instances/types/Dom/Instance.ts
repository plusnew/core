import PlusnewAbstractElement from 'PlusnewAbstractElement';
import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import { getSpecialNamespace } from '../../../util/namespace';
import { hasOnchangeEvent, hasInputEvent } from '../../../util/dom';

const PropToAttribbuteMapping = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
};

export default class DomInstance extends ChildrenInstance {
  public nodeType = types.Dom;
  public props: PlusnewAbstractElement;
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
    this.setOnChangeEvent();
  }

  private setNamespace() {
    this.namespace = getSpecialNamespace(this.props.type as string) || this.namespace;
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
    for (const index in this.props.props) {
      this.setProp(index, this.props.props[index]);
    }

    return this;
  }

  /**
   * sets the actual property on the element
   */
  public setProp(key: string, value: any) {
    const keyName = this.getAttributeNameFromProp(key);
    if (this.ignoreProperty(key)) {
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
        if (this.setAttributeAsProperty(keyName)) {
          // input-values need to be set directly as property, for overwriting purpose of browser behaviour
          (this.ref as any)[keyName] = value;
        }
      }
    }

    return this;
  }

  private setOnChangeEvent() {
    if (hasOnchangeEvent(this.props)) {
      const onchangeWrapper = (evt: Event) => {
        let preventDefault = true;
        this.setProp = (key, value) => {
          if ((evt.target as HTMLInputElement).value === value) {
            preventDefault = false;

          } else {
            DomInstance.prototype.setProp.call(this, key, value);
            preventDefault = true;
          }

          return this;
        };

        this.props.props.onchange(evt);

        if (preventDefault === true) {
          (this.ref as HTMLInputElement).value = this.props.props.value;
        }
        delete this.setProp;
      };

      if (hasInputEvent(this.props)) {
        (this.ref as HTMLElement).oninput = onchangeWrapper;
      }
      (this.ref as HTMLElement).onchange = onchangeWrapper;
    }

    return this;
  }

  private ignoreProperty(key: string) {
    return (
      key === 'key' ||
      key === 'children' ||
      (key === 'onchange' && hasOnchangeEvent(this.props))
    );
  }

  setAttributeAsProperty(keyName: string) {
    return this.props.type === 'input' && keyName === 'value';
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
    this.rendered.forEach(child => child.remove());
    (this.ref.parentNode as Node).removeChild(this.ref);

    return this;
  }
}
