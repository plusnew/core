import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';

const PropToAttribbuteMapping = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
};

export default class DomInstance extends ChildrenInstance {
  public type = types.Dom;
  public abstractElement: PlusnewAbstractElement;
  public ref: HTMLElement;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.ref = document.createElement(abstractElement.type as string);

    this.setProps().addChildren(abstractElement.props.children);

    this.appendToParent(this.ref, previousAbstractSiblingCount());
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
    this.ref.oninput = (evt: Event) => {
      this.setNormalProp = (key: string, value: any) => {
        // if (key === 'value') {
        //   if (value === (evt.target as HTMLInputElement).value) {

        //   } else {
        //   }
        // } else {
        DomInstance.prototype.setNormalProp.call(this, key, value);
        // }
      };
      this.abstractElement.props.onchange(evt);
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
      // All the other attributes are strings
      this.ref.setAttribute(keyName, value + '');
    }
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
