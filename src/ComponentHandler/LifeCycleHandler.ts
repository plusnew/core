import ComponentHandler from './index';

export default class LifeCycleHandler {
  /**
   * the instance of the internal component
   */
  private componentHandler: ComponentHandler;

  /**
   * this layer is the public api to the applicationcode
   */
  constructor(componentHandler: ComponentHandler) {
    this.componentHandler = componentHandler;
  }

  /**
   * when this function is called, some values of the component did change
   */
  public componentCheckUpdate() {
    this.componentHandler.setDirty();
    return this;
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
