import ComponentInstance from '../instances/types/Component/Instance';
import { ApplicationElement, props } from '../interfaces/component';
import { Observer } from '../util/store';
import Instance from '../instances/types/Instance';
import types from '../instances/types/types';

function hasComponent(instance?: Instance): boolean {
  if (!instance) {
    return false;
  }
  if (instance.nodeType === types.Component) {
    return true;
  }

  return hasComponent(instance.parentInstance);
}

export default abstract class Component<componentProps extends Partial<props & { children: any}>> {
  static displayName = '';

  constructor(props: componentProps) {
  }

  abstract render(props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps>): ApplicationElement;

  componentWillUnmount(props: componentProps) {}

  static shouldCreateComponent(parentInstance: Instance) {
    return parentInstance.createChildrenComponents === true || hasComponent(parentInstance) === false;
  }
}
