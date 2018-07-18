import { store } from 'redchain';
import ComponentInstance from '../instances/types/Component/Instance';
import { options, props } from '../interfaces/component';
import AbstractClass from '../components/AbstractClass';

export type result = plusnew.JSX.Element | null;
export interface componentResult<componentProps extends Partial<props>> {
  (props: componentProps, instance: ComponentInstance): plusnew.JSX.Element | null;
}

export interface stores {
  [key: string]: store<any, any>;
}

export interface Component<componentProps> {
  new (props: componentProps): AbstractClass<componentProps>;
}

export interface factory {
  <dependencies extends stores, componentProps extends Partial<props>>(
    displayName: string,
    constructor: (props: componentProps, options: options<componentProps, dependencies>) => dependencies,
    render: (props: componentProps, dependencies: dependencies, options: options<componentProps, dependencies>) => result,
  ): Component<componentProps>;
}

const factory: factory = <componentProps extends Partial<props>, dependencies extends stores>(
  displayName: string,
  constructor: (props: componentProps, options: options<componentProps, dependencies>) => dependencies,
  render: (props: componentProps, dependencies: dependencies, options: options<componentProps, dependencies>) => result,
) => {
  class Component extends AbstractClass<componentProps> {
    dependencies = {};
    config: any;

    constructor(props: componentProps, config: any) {
      super(props);
      this.dependencies = constructor(props, config);
      this.config = config;
    }

    render(props: componentProps) {
      return render(props, this.dependencies as any, this.config) as any;
    }
  }

  Component.prototype.displayName = displayName;

  return Component as any;
};

export default factory;
