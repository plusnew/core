import types from '../types';
import Instance, { getPredeccessor } from '../Instance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';

export default class ShallowInstance extends Instance {
  public nodeType = types.Component;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElement, parentInstance, getPredecessor);

    this.type = abstractElement.type;
    this.props = abstractElement.props;
  }

  public getLastIntrinsicElement() {
    return null;
  }

  /**
   * shallowcomponent has no object, which needs moving
   */
  public move() {
    // Because shallowcomponents are not really inserted in the dom, no actual action is needed
  }

  /**
   * shallowcomponent has no object, which needs removing
   */
  public remove() {}

  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    this.props = newAbstractElement.props;
  }
}
