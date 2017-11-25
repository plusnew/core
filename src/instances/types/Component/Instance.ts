import types from '../types';
import Instance from '../Instance';
import factory from '../../factory';
import componentReconcile from './reconcile';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
import component, { props, deps, componentResult } from 'interfaces/component';
import scheduler from 'scheduler';

export default class ComponentInstance extends Instance {
  public type = types.Component;
  public abstractElement: PlusnewAbstractElement;
  public children: Instance;
  public componentResult: componentResult<props, deps>;
  
  private dirty: boolean;

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
    this.componentResult = (this.abstractElement.type as component<any, any>)(props);
    for (const dependencyIndex in this.componentResult.dependencies) {
      const dependency = this.componentResult.dependencies[dependencyIndex];
      dependency.addOnChange(this.setDirty.bind(this));
    }
    this.dirty = false;

    return this;
  }

    /**
     * asks the component what should be changed and puts it to the factory
     */
  private handleChildren() {
    const abstractChildren = this.componentResult.render(this.abstractElement.props, this.componentResult.dependencies);
    this.children = factory(abstractChildren, this, () => this.previousAbstractSiblingCount());
  }

  /**
   * sets the component to a state where it needs a rerender
   */
  public setDirty() {
    if (this.dirty === false) {
      this.dirty = true;
      scheduler.add(this.update.bind(this));
      scheduler.cleanWhenNotProcessing();
    }

    return this;
  }

  /**
   * when the dirtyflag is set, unsets the dirtyflag and rerenders and informs the domhandler
   */
  private update() {
    // The dirtyflag is needed, if the setDirty and the scheduler are called multiple times
    if (this.dirty === true) {
      this.dirty = false;
      componentReconcile(this.abstractElement, this);
    }

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
