import ConfigInterface from '../Interface/ConfigInterface';
import ComponentInterface from '../Interface/ComponentInterface';
import TemplateInterface from '../Interface/TemplateInterface';
import statelog from 'statelog';

class ComponentHandler {
  component: ComponentInterface;
  template: TemplateInterface;
  state: any;
  props: any;
  id: number;
  constructor(Component: typeof ComponentInterface,
              Template: typeof TemplateInterface,
              props: any) {
    this.state = statelog.create({});
    this.props = props;
    this.component = new Component(this.state, this.props, this);
    this.template = new Template(this.id, this.state, this.props);
  }

  public appendToDom(element: HTMLElement) {
    for (let i = 0; i < this.template.roots.length; i += 1) {
      element.appendChild(this.template.roots[i].element);
    }
    return this;
  }
}

export default ComponentHandler;
