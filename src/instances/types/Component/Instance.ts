import Instance, { predecessor, getPredeccessor } from '../Instance';
import types from '../types';
import Component from '../../../components/AbstractClass';
import { props, ApplicationElement } from  '../../../interfaces/component';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import store, { storeType } from '../../../util/store';
import factory from '../../factory';
import reconcile from './reconcile';

/**
 * ComponentInstances are used representing the <Component /> in the shadowdom
 * or when plusnew.createElement gets called with a function
 * it calls the constructure function and keeps the informations what dependencies the component has
 * the render-function of the component gets called immediately after the constructor-function
 * the render-function gets called again when a parent component rerenders
 * or when the dependencie-stores fire the change event
 */
export default class ComponentInstance<componentProps extends Partial<props>> extends Instance {
  public nodeType = types.Component;
  public rendered: Instance; // @FIXME This actually should be Instance or undefined
  public applicationInstance: Component<componentProps>;
  public props: storeType<componentProps, componentProps>;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElement, parentInstance, getPredecessor);

    this.type = abstractElement.type;
    this.props = store(abstractElement.props as componentProps, (_state, props: componentProps) => props);

    this.initialiseComponent();
  }

  public initialiseComponent() {
    this.applicationInstance = new (this.type as any)(this.props);
    const abstractChildren = this.applicationInstance.render(this.props.Observer, this);
    this.render(abstractChildren);
  }

  public render(abstractChildren: ApplicationElement) {
    if (this.rendered) {
      reconcile(abstractChildren, this);
    } else {
      this.rendered = factory(abstractChildren, this, () => this.getPredecessor());
    }
  }

  public getLastIntrinsicElement() {
    return this.rendered.getLastIntrinsicElement();
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    this.props.dispatch(newAbstractElement.props as componentProps);
  }

  /**
   * moves the children to another dom position
   */
  public move(predecessor: predecessor) {
    this.rendered.move(predecessor);
  }

  /**
   * removes the children from the dom
   */
  public remove(prepareRemoveSelf: boolean) {
    if (this.applicationInstance.componentWillUnmount) {
      this.applicationInstance.componentWillUnmount(this.props.getState());
    }

    return this.rendered.remove(prepareRemoveSelf);
  }
}
