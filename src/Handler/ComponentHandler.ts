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
}

export default ComponentHandler;
