import ComponentInstance from '../instances/types/Component/Instance';
import { ApplicationElement, props } from '../interfaces/component';
import { Observer } from '../util/store';

export default abstract class Component<componentProps extends Partial<props>> {
  displayName = '';

  constructor(props: componentProps) {
  }

  abstract render(props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps>): ApplicationElement;

  componentWillUnmount(props: componentProps) {}
}
