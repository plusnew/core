import types from '../types';
import Instance from '../Instance';
import factory from '../../factory';
import componentReconcile from './reconcile';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import component, { render, deps, nothing } from '../../../interfaces/component';

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
nothing;

export default class ComponentInstance extends Instance {
  public type = types.Component;
  public abstractElement: PlusnewAbstractElement;
  public children: Instance;
  public render: render<any>;
  public dependencies: deps;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.createChildrenComponents = this.abstractElement.createChildrenComponents;
    // Each instance needs its own update method - to have a unique method to be removed from the dependency-listeners
    this.update = this.update.bind(this);
    this.initialiseComponent();
  }

  /**
   * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
   */
  private initialiseComponent() {
    const props = this.abstractElement.props;
    (this.abstractElement.type as component<any>)(props, this);

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
  public handleChildren(render: render<any>, dependencies: deps) {
    this.registerRender(render)
        .registerDependencies(dependencies);

    const abstractChildren = this.render(this.abstractElement.props, this.dependencies);
    this.children = factory(abstractChildren, this, () => this.previousAbstractSiblingCount());

    return this;
  }

  /**
   * rerenders and informs the domhandler
   */
  private update() {
    componentReconcile(this.abstractElement, this);

    return this;
  }

  /**
   * moves the children to another dom position
   */
  public move(position: number) {
    this.children.move(position);

    return this;
  }

  public getLength() {
    return this.children.getLength();
  }

  /**
   * removes the children from the dom
   */
  public remove() {
    this.removeDependencyListeners();
    this.children.remove();

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
