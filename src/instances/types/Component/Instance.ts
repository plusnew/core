import types from '../types';
import Instance from '../Instance';
import factory from '../../factory';
import reconcile, { shouldUpdate } from './reconcile';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import component, { constructor, render, deps, options, nothing, props } from '../../../interfaces/component';

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
nothing;

export default class ComponentInstance extends Instance {
  public nodeType = types.Component;
  public rendered: Instance;
  public options: options<any, any> = {};
  public render: render<any>;
  public dependencies: deps;
  public props: props;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

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
    (this.type as component<any>)(props, this);

    return this;
  }

  private registerRender(render: render<any>) {
    this.render = render;

    return this;
  }

  private registerDependencies(dependencies: deps) {
    for (const dependencyIndex in dependencies) {
      const dependency = dependencies[dependencyIndex];
      dependency.addOnChange(this.update);
    }
    this.dependencies = dependencies;

    return this;
  }
  /**
   * asks the component what should be changed and puts it to the factory
   */
  public setComponentParts(constructor: constructor<any, any>, render: render<any>) {
    this
        .registerRender(render)
        .registerDependencies(constructor(this.props, this.options));

    const abstractChildren = this.render(this.props, this.dependencies, this.options);
    this.rendered = factory(abstractChildren, this, () => this.previousAbstractSiblingCount());

    return this;
  }

  /**
   * rerenders and informs the domhandler
   */
  private update() {
    reconcile(this.props, this);

    return this;
  }

  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    if (shouldUpdate((newAbstractElement as PlusnewAbstractElement).props, this)) {
      reconcile(newAbstractElement.props, this);
    }
    return this;
  }

  /**
   * moves the children to another dom position
   */
  public move(position: number) {
    this.rendered.move(position);

    return this;
  }

  public getLength() {
    return this.rendered.getLength();
  }

  /**
   * removes the children from the dom
   */
  public remove() {
    this.removeDependencyListeners();
    if (this.options.componentWillUnmount) {
      this.options.componentWillUnmount(this.props, this.dependencies);
    }
    this.rendered.remove();

    return this;
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
