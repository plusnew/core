import types from '../types';
import Instance, { getPredeccessor } from '../Instance';
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
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElement, parentInstance, getPredecessor);
    this.props = abstractElement.props;
    this.addChildren(abstractElement.props.children);
  }

  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    reconcile(newAbstractElement, this);
    return this;
  }

  public getChildrenPredeccessor() {
    return this.getPredecessor();
  }
}
