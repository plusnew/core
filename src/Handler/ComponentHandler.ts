// import ConfigInterface from '../Interface/ConfigInterface';
import ComponentInterface from '../Interface/ComponentInterface';
import { Template } from 'tempart';
import statelog from 'statelog';

class ComponentHandler {
  component: ComponentInterface;
  template: Template;
  state: any;
  props: any;
  id: number;

  constructor(Component: typeof ComponentInterface,
              TempartTemplate: typeof Template,
              props: any) {
    this.state = statelog.create({});
    this.props = props;
    this.component = new Component(this.state, this.props, this);
    this.template = new TempartTemplate(this.id + '', this.state, this.props);
  }

  public appendToDom(element: HTMLElement) {
    for (let i = 0; i < this.template.roots.length; i += 1) {
      element.appendChild(<Node>this.template.roots[i].element);
    }
    return this;
  }
}

export default ComponentHandler;
