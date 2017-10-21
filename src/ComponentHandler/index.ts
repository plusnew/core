import component, { ApplicationElement } from 'interfaces/component';
import LifeCycleHandler from './LifeCycleHandler';
import DomHandler from './DomHandler';
import Instance from './DomHandler/Instance/Instance';
import scheduler from 'scheduler';

export default class ComponentHandler {
  /**
   * storage for the componentclass
   */
  private type: component<any>;

  /**
   * saves the properties this component got
   */
  private props: any;

  /**
   * this handler does the actual DOM manipulation, can be HTML and SVG
   */
  public domHandler: DomHandler;
  
  /**
   * is the information if the component needs a rererender
   */
  private dirty: boolean;

  /**
   * the renderFunction of the component, returns abstract representation of the new domnodes
   */
  private renderFunction: (props?: any) => ApplicationElement;

  /**
   * the componenthandler is the handler in between the application code and the dom manipulations 
   */
  constructor(type: component<any>, props: any, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    this.setType(type)
        .setProps(props)
        .initialiseComponent()
        .initialiseDomHandler(parentInstance, previousAbstractSiblingCount)
        .renderInitialDom();
  }

  /**
   * saves the componentfunction
   */
  private setType(type: component<any>) {
    this.type = type;

    return this;
  }

  /**
   * saves the new properties, and notifies that the component needs a rerender eventually
   */
  public setProps(props: any) {
    this.props = props;
    // @TODO check if isEqual and then do a rerender
    this.setDirty();

    return this;
  }

  /**
   * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
   */
  private initialiseComponent() {
    this.renderFunction = this.type(new LifeCycleHandler(this), this.props);

    return this;
  }

  /**
   * the layer for the dommanipulations
   */
  private initialiseDomHandler(parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    this.domHandler = new DomHandler(parentInstance, previousAbstractSiblingCount);

    return this;
  }

  /**
   * the domHandler sets its root-elements to the HTMLElements
   */
  private renderInitialDom() {
    this.dirty = false;
    this.domHandler.create(this.renderFunction(this.props));

    return this;
  }

  /**
   * sets the component to a state where it needs a rerender
   */
  public setDirty() {
    if (this.dirty === false) {
      this.dirty = true;
      scheduler.add(this.update.bind(this));
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
      this.domHandler.update(this.renderFunction(this.props));
    }

    return this;
  }
}
