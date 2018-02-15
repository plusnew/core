import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';

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
   * calculates the previous siblinglength
   */
  public getPreviousLength(instanceIndex: number) {
    let previousCount = 0;

    for (let i = 0; i < instanceIndex; i += 1) {
      previousCount += this.children[i].getLength();
    }
    return previousCount;
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

  private setNormalProp(key: string, value: any) {
    (this.ref as any)[key] = value; // @TODO should probably be improved
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
    (this.ref.parentNode as Node).removeChild(this.ref);

    return this;
  }
}
