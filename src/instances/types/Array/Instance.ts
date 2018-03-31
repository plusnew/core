import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';

export default class ArrayInstance extends ChildrenInstance {
  public nodeType = types.Array;
  public props: (PlusnewAbstractElement)[];

  constructor(
    abstractElements: (PlusnewAbstractElement)[],
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElements, parentInstance, previousAbstractSiblingCount);

    this.addChildren(abstractElements);
  }

  /**
   * calculates the previous siblinglength, array is not its own parent, children are dependent of previousAbstractSiblingCount
   */
  public getPreviousSiblingsForChildren() {
    return this.previousAbstractSiblingCount();
  }
}
