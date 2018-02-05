import types from '../types';
import Instance from '../Instance';
import factory from '../../factory';
import componentReconcile from './reconcile';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import component, { render, deps } from '../../../interfaces/component';

export default class ComponentInstance extends Instance {
  public type = types.Component;
  public abstractElement: PlusnewAbstractElement;
  public children: Instance;
  public render: render<any>;
  public dependencies: deps;

  constructor(abstractElement: PlusnewAbstractElement, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);
    this.initialiseComponent()
      .handleChildren();
  }

  /**
   * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
   */
  private initialiseComponent() {
    const props = this.abstractElement.props;
    (this.abstractElement.type as component<any>)(props, this);

    return this;
  }

  public registerRender(render: render<any>) {
    this.render = render;
  }

  public registerDependencies(dependencies: deps) {
    for (const dependencyIndex in dependencies) {
      const dependency = dependencies[dependencyIndex];
      dependency.addOnChange(this.update.bind(this));
    }
    this.dependencies = dependencies;
  }
  /**
   * asks the component what should be changed and puts it to the factory
   */
  private handleChildren() {
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
    this.children.remove();

    return this;
  }
}
