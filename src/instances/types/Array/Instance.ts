import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

export default class ComponentInstance extends ChildrenInstance {
  public type = types.Array;
  public abstractElement: (PlusnewAbstractElement | string)[];

  constructor(abstractElements: (PlusnewAbstractElement | string)[], parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElements, parentInstance, previousAbstractSiblingCount);

    this.addChildren(abstractElements);
  }
}
