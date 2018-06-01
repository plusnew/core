import { props } from '../../../interfaces/component';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import ChildrenInstance from '../ChildrenInstance';
import Instance, { getPredeccessor } from '../Instance';
import types from '../types';
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
  }

  public getChildrenPredeccessor() {
    return this.getPredecessor();
  }
}
