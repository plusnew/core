import ComponentHandler from './Instance';

export default class LifeCycleHandler {
  /**
   * the instance of the internal component
   */
  private componentHandler: ComponentHandler;

  public componentCheckUpdate: () => LifeCycleHandler;

  /**
   * this layer is the public api to the applicationcode
   */
  constructor(componentHandler: ComponentHandler) {
    this.componentHandler = componentHandler;
    this.componentCheckUpdate = this.componentHandler.setDirty.bind(this.componentHandler);
  }

  // public componentWillMount() {
  //   return this;
  // }
  // public componentDidMount() {
  //   return this;
  // }

  // public componentWillReceiveProps() {
  //   return this;
  // }
  // public shouldComponentUpdate() {
  //   return this;
  // }
  // public componentWillUpdate() {
  //   return this;
  // }
  // public componentDidUpdate() {
  //   return this;
  // }

  // public componentWillUnmount() {
  //   return this;
  // }
}
