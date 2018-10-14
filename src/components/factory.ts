import ComponentInstance from '../instances/types/Component/Instance';
import { props, ApplicationElement } from '../interfaces/component';
import AbstractClass from '../components/AbstractClass';
import { Observer } from '../util/store';
import Instance from '../instances/types/Instance';

export type componentResult<componentProps extends Partial<props>> = {
  (props: componentProps, instance: ComponentInstance<componentProps>): plusnew.JSX.Element | null;
};

export interface ComponentContainer<componentProps> {
  new (props: componentProps): AbstractClass<componentProps>;
  prototype: AbstractClass<componentProps>;
  displayName: string;
  shouldCreateComponent(instance: Instance): boolean;
}

export type factory = {
  <componentProps extends Partial<props>>(
    displayName: string,
    render: (Props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps>) => ApplicationElement,
  ): ComponentContainer<componentProps>;
};

const factory: factory = <componentProps extends Partial<props>>(
  displayName: string,
  render: (Props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps>) => ApplicationElement,
) => {
  class Component extends AbstractClass<componentProps> {
    dependencies = {};
    config: any;

    constructor(props: componentProps) {
      super(props);
    }

    render(Props: Observer<componentProps>, plusnewComponentInstance: ComponentInstance<componentProps>) {
      return render(Props, plusnewComponentInstance);
    }
  }

  Component.displayName = displayName;

  return Component as any;
};

export default factory;
