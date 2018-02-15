import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';

export default class FragmentInstance extends ChildrenInstance {
  public type = types.Fragment;
  public abstractElement: PlusnewAbstractElement;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.addChildren(abstractElement.props.children);
  }

  /**
   * calculates the previous siblinglength, array is not its own parent, children are dependent of previousAbstractSiblingCount
   */
  public getPreviousSiblingsForChildren() {
    return this.previousAbstractSiblingCount();
  }
}
