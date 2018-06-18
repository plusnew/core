import component, { constructor, deps, nothing, options, props, render } from '../../../interfaces/component';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import factory from '../../factory';
import Instance, { getPredeccessor, predecessor } from '../Instance';
import types from '../types';
import reconcile, { shouldUpdate } from './reconcile';

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
  public options: options<any, any>;
  public render: render<any>;
  public dependencies: deps;
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
    this.setOptions();
    this.initialiseComponent();
  }

  /**
   * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
   */
  private initialiseComponent() {
    const props = this.props;
    (this.type as component<any>)(props, this);
  }

  private registerRender(render: render<any>) {
    this.render = render;
  }

  private registerDependencies(dependencies: deps) {
    for (const dependencyIndex in dependencies) {
      const dependency = dependencies[dependencyIndex];
      dependency.addOnChange(this.update);
    }
    this.dependencies = dependencies;
  }

  /**
   * sets the initial options object
   */
  private setOptions() {
    this.options = {
      instance: this,
    };
  }

  /**
   * asks the component what should be changed and puts it to the factory
   */
  public setComponentParts(constructor: constructor<any, any>, render: render<any>) {
    this.registerRender(render);
    this.registerDependencies(constructor(this.props, this.options));

    const abstractChildren = this.render(this.props, this.dependencies, this.options);
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
    this.removeDependencyListeners();
    if (this.options.componentWillUnmount) {
      this.options.componentWillUnmount(this.props, this.dependencies);
    }
    return this.rendered.remove(prepareRemoveSelf);
  }

  /**
   * removes the dependencylisteners from the instance
   * without this there would be memoryleaks and unecessary reconsiling without any visible effect
  */
  private removeDependencyListeners() {
    for (const index in this.dependencies) {
      this.dependencies[index].removeOnChange(this.update);
    }
  }
}
