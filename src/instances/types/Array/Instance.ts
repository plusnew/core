import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import ChildrenInstance from '../ChildrenInstance';
import Instance, { getPredeccessor } from '../Instance';
import types from '../types';
import reconcile from './reconcile';

export default class ArrayInstance extends ChildrenInstance {
  public nodeType = types.Array;
  public type = types.Array;
  public props: (PlusnewAbstractElement)[];

  constructor(
    abstractElements: (PlusnewAbstractElement)[],
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElements, parentInstance, getPredecessor);
    this.props = abstractElements;
    this.addChildren(abstractElements);
  }

  public reconcile(newAbstractElements: PlusnewAbstractElement[]) {
    reconcile(newAbstractElements, this);
  }

  public getChildrenPredeccessor() {
    return this.getPredecessor();
  }
}
