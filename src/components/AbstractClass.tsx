import ComponentInstance from '../instances/types/Component/Instance';
import { ApplicationElement } from '../interfaces/component';
import { Consumer } from '../util/store';

export default abstract class Component<props> {
  displayName = '';

  constructor(props: props) {
  }

  abstract render(props: Consumer<props>, plusnewComponentInstance: ComponentInstance): ApplicationElement;

  componentWillUnmount(props: props) {}
}
