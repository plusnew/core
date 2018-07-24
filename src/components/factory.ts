import ComponentInstance from '../instances/types/Component/Instance';
import { props, ApplicationElement } from '../interfaces/component';
import AbstractClass from '../components/AbstractClass';
import { Consumer } from '../util/store';

export interface componentResult<componentProps extends Partial<props>> {
  (props: componentProps, instance: ComponentInstance): plusnew.JSX.Element | null;
}

export interface ComponentContainer<componentProps> {
  new (props: componentProps): AbstractClass<componentProps>;
}

export interface factory {
  <componentProps extends Partial<props>>(
    displayName: string,
    render: (Props: Consumer<componentProps>, plusnewComponentInstance: ComponentInstance) => ApplicationElement,
  ): ComponentContainer<componentProps>;
}

const factory: factory = <componentProps extends Partial<props>>(
  displayName: string,
  render: (Props: Consumer<componentProps>, plusnewComponentInstance: ComponentInstance) => ApplicationElement,
) => {
  class Component extends AbstractClass<componentProps> {
    dependencies = {};
    config: any;

    constructor(props: componentProps) {
      super(props);
    }

    render(Props: Consumer<componentProps>, plusnewComponentInstance: ComponentInstance) {
      return render(Props, plusnewComponentInstance);
    }
  }

  Component.prototype.displayName = displayName;

  return Component as any;
};

export default factory;
