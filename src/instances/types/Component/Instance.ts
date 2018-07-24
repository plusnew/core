import { nothing, props } from '../../../interfaces/component';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import factory from '../../factory';
import Instance, { getPredeccessor, predecessor } from '../Instance';
import types from '../types';
import reconcile, { shouldUpdate } from './reconcile';
import Component from '../../../components/AbstractClass';

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
nothing;

/**
 * ComponentInstances are used representing the <Component /> in the shadowdom
 * or when plusnew.createElement gets called with a function
 * it calls the constructure function and keeps the informations what dependencies the component has
 * the render-function of the component gets called immediately after the constructor-function
 * the render-function gets called again when a parent component rerenders
 * or when the dependencie-stores fire the change event
 */
export default class ComponentInstance extends Instance {
  public nodeType = types.Component;
  public rendered: Instance;
  public applicationInstance: Component<any>;
  public props: props;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElement, parentInstance, getPredecessor);

    this.type = abstractElement.type;
    this.props = abstractElement.props;
    // Each instance needs its own update method - to have a unique method to be removed from the dependency-listeners
    this.update = this.update.bind(this);
    this.initialiseComponent();
  }

  /**
   * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
   */
  private initialiseComponent() {
    const props = this.props;
    this.applicationInstance = new (this.type as any)(props);
    this.render();

  }

  /**
   * asks the component what should be changed and puts it to the factory
   */
  public render() {
    const abstractChildren = this.applicationInstance.render(this.props, this);
    this.rendered = factory(abstractChildren, this, () => this.getPredecessor());
  }

  public getLastIntrinsicElement() {
    return this.rendered.getLastIntrinsicElement();
  }

  /**
   * rerenders and informs the domhandler
   */
  private update() {
    reconcile(this.props, this);
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    if (shouldUpdate((newAbstractElement as PlusnewAbstractElement).props, this)) {
      reconcile(newAbstractElement.props, this);
    }
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
      this.applicationInstance.componentWillUnmount(this.props);
    }
    return this.rendered.remove(prepareRemoveSelf);
  }
}
