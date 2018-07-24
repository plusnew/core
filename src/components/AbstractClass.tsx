import ComponentInstance from 'instances/types/Component/Instance';
import { ApplicationElement } from 'interfaces/component';

export default abstract class Component<props> {
  displayName = '';

  constructor(props: props) {
  }

  abstract render(props: props, plusnewComponentInstance: ComponentInstance): ApplicationElement;

  componentWillUnmount(props: props) {}
}
