import types from '../types';
import Instance, { getSuccessor } from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import { props } from '../../../interfaces/component';
import reconcile from './reconcile';

export default class FragmentInstance extends ChildrenInstance {
  public nodeType = types.Fragment;
  public type = types.Fragment;
  public props: props;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    getSuccessor: getSuccessor,
  ) {
    super(abstractElement, parentInstance, getSuccessor);
    this.props = abstractElement.props;
    this.addChildren(abstractElement.props.children);
  }

  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    reconcile(newAbstractElement, this);
    return this;
  }

  public getChildrenSuccessor() {
    return this.getSuccessor();
  }
}
