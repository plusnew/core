import ConfigInterface from './Interface/ConfigInterface';
import ComponentHandler from './Handler/ComponentHandler';

class Main {
  config: ConfigInterface;

  constructor(config: ConfigInterface) {
    this.config = config;
  }

  public create(componentName: string, props?: any) {
    return new ComponentHandler(
      this.getComponent(componentName),
      this.getTemplate(componentName),
      props,
    );
  }

  public getComponent(componentName: string) {
    return this.config.components[componentName];
  }

  public getTemplate(componentName: string) {
    return this.config.templates[componentName];
  }
}

export default Main;

(<any>window).Snew = Main;
