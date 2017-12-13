import PlusnewAbstractElement from 'PlusnewAbstractElement';
import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';

export default class DomInstance extends ChildrenInstance {
  public type = types.Dom;
  public abstractElement: PlusnewAbstractElement;
  public ref: HTMLElement;

  constructor(abstractElement: PlusnewAbstractElement, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    if (typeof (abstractElement.type) === 'string') {
      this.ref = document.createElement(abstractElement.type);
    } else {
      throw new Error('Could not createdom element with type not being a string');
    }

    this.setProps()
      .addChildren(abstractElement.props.children);

    this.appendToParent(this.ref, previousAbstractSiblingCount());
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
  public setProp(key: string, value: string) {
    if (this.abstractElement.shouldAddPropToElement(key) === true) {
      (this.ref as any)[key] = value; // @TODO should probably be improved
    }

    return this;
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
  public appendChild(element: Node) {
    this.ref.appendChild(element);

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
