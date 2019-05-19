import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import Instance, { getPredeccessor } from '../Instance';
import types from '../types';
import { props } from  '../../../interfaces/component';
import { renderOptions } from '../../../interfaces/renderOptions';

export default class ShallowInstance<componentProps extends Partial<props>>  extends Instance {
  public nodeType = types.Component;
  public props: componentProps;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
    renderOptions: renderOptions,
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);

    this.type = abstractElement.type;
    this.props = abstractElement.props as componentProps;
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

  /**
   * a shallow instance is nothing actually present in the dom
   * it just needs to hold all the currently interesting informations
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    this.props = newAbstractElement.props as componentProps;
  }
}
