import PlusnewAbstractElement from 'PlusnewAbstractElement';
import types from './types';
import Instance from './Instance';
import ChildrenInstance from './ChildrenInstance';

const REMAPS: { [key: string]: string } = {
  className: 'class',
};

export default class ComponentInstance extends ChildrenInstance {
  public type: types.Dom;
  public abstractElement: PlusnewAbstractElement;
  public ref: HTMLElement;

  constructor(abstractElement: PlusnewAbstractElement, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    if (typeof(abstractElement.type) === 'string') {
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
      const remappedIndex = this.remapProps(index);
      if (this.abstractElement.shouldAddPropToElement(remappedIndex) === true) {
        this.ref.setAttribute(remappedIndex, this.abstractElement.props[index]);
      }
    }

    return this;
  }

  /**
   * remaps the props, like class and className
   */
  private remapProps(propName: string) {
    if (propName in REMAPS) {
      return REMAPS[propName] as string;
    } else {
      return propName;
    }
  }
  /**
   * domnode is always a length of one
   */
  getLength() {
    return 1;
  }

  /**
   * by the children should add themselfs to our element
   */
  public appendChild(element: Node) {
    if (this.parentInstance === undefined) {
      throw new Error('Couldn\'t add child to parent');
    } else {
      this.ref.appendChild(element);
    }
    return this;
  }
}
