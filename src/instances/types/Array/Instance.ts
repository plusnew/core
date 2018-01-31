import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';

export default class ArrayInstance extends ChildrenInstance {
  public type = types.Array;
  public abstractElement: (PlusnewAbstractElement)[];

  constructor(abstractElements: (PlusnewAbstractElement)[], parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElements, parentInstance, previousAbstractSiblingCount);

    this.addChildren(abstractElements);
  }
}
