import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';

export default class ArrayInstance extends ChildrenInstance {
  public type = types.Array;
  public abstractElement: (PlusnewAbstractElement)[];

  constructor(
    abstractElements: (PlusnewAbstractElement)[],
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElements, parentInstance, previousAbstractSiblingCount);

    this.addChildren(abstractElements);
  }

  /**
   * calculates the previous siblinglength
   */
  public getPreviousLength(instanceIndex: number) {
    let previousCount = this.previousAbstractSiblingCount();

    for (let i = 0; i < instanceIndex; i += 1) {
      previousCount += this.children[i].getLength();
    }
    return previousCount;
  }
}
