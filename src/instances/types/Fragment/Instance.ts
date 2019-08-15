import { props } from '../../../interfaces/component';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import ChildrenInstance from '../ChildrenInstance';
import Instance, { getPredeccessor } from '../Instance';
import types from '../types';
import reconcile from './reconcile';
import { renderOptions } from '../../../interfaces/renderOptions';

/**
 * FragmentInstances are representations of <>
 * or when plusnew.createElement gets called with plusnew.Fragment
 *
 * it is used as a container for the given children, and doesn't do much else
 */
export default class FragmentInstance<HostElement, HostTextElement> extends ChildrenInstance<HostElement, HostTextElement> {
  public nodeType = types.Fragment;
  public type = types.Fragment;
  public props: props;
  public executeChildrenElementWillUnmount = true;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>,
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);
    this.props = abstractElement.props;
  }

  initialiseNestedElements() {
    this.addChildren();
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    reconcile(newAbstractElement, this);
  }

  /**
   * gets dom element predecessing the fragment for the children instances
   * and returns the predeccessor of this fragment
   */
  public getChildrenPredeccessor() {
    return this.getPredecessor();
  }
}
