import ComponentInstance from '../instances/types/Component/Instance';
import { props, ApplicationElement } from '../interfaces/component';
import AbstractClass from '../components/AbstractClass';
import { Observer } from '../util/store';
import Instance from '../instances/types/Instance';

export type componentResult<componentProps extends Partial<props>> = {
  (props: componentProps, instance: ComponentInstance<componentProps, unknown, unknown>): plusnew.JSX.Element | null;
};

export interface ComponentContainer<componentProps, HostElement, HostTextElement> {
  new (props: componentProps, componentInstance: ComponentInstance<componentProps, HostElement, HostTextElement>): AbstractClass<componentProps>;
  prototype: AbstractClass<componentProps>;
  displayName: string;
  shouldCreateComponent(instance: Instance<HostElement, HostTextElement>): boolean;
}

export type factory = {
  <componentProps extends Partial<props>, HostElement, HostTextElement>(
    displayName: string,
    render: (Props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps, unknown, unknown>) => ApplicationElement,
  ): ComponentContainer<componentProps, HostElement, HostTextElement>;
};

const factory: factory = <componentProps extends Partial<props>>(
  displayName: string,
  render: (Props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps, unknown, unknown>) => ApplicationElement,
) => {
  class Component extends AbstractClass<componentProps> {
    public displayName = displayName;
    public component = render;
    constructor(props: componentProps, componentInstance: ComponentInstance<componentProps, unknown, unknown>) {
      super(props, componentInstance);
    }

    render(Props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps, unknown, unknown>) {
      return render(Props, plusnewComponentInstance);
    }
  }

  Component.displayName = displayName;

  return Component as any;
};

export default factory;
