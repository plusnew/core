import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import Instance, { getPredeccessor } from '../Instance';
import types from '../types';
import store, { storeType} from '../../../util/store';
import { props } from  '../../../interfaces/component';

export default class ShallowInstance<componentProps extends Partial<props>>  extends Instance {
  public nodeType = types.Component;
  public props: storeType<componentProps, componentProps>;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElement, parentInstance, getPredecessor);

    this.type = abstractElement.type;
    this.props = store(abstractElement.props as componentProps, (_state, action: componentProps) => action);
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
    this.props.dispatch(newAbstractElement.props as componentProps);
  }
}
