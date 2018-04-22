import types from '../types';
import Instance from '../Instance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';

export default class ShallowInstance extends Instance {
  public nodeType = types.Component;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.type = abstractElement.type;
    this.props = abstractElement.props;
  }

 /**
   * the shallowcomponent is not a dom object, that's why it has no length
   */
  public getLength() {
    return 0;
  }

  /**
   * shallowcomponent has no object, which needs moving
   */
  public move() {
    // Because shallowcomponents are not really inserted in the dom, no actual action is needed
    return this;
  }

  /**
   * shallowcomponent has no object, which needs removing
   */
  public remove() {
    return this;
  }

  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    this.props = newAbstractElement.props;
    return this;
  }
}
