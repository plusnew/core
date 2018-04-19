import ComponentInstance from '../instances/types/Component/Instance';
import { props, options } from '../interfaces/component';
import { store } from 'redchain';

export type result = plusnew.JSX.Element | null;
export interface componentResult<componentProps extends Partial<props>> {
  (props: componentProps, instance: ComponentInstance): plusnew.JSX.Element | null;
}

export interface stores {
  [key: string]: store<any, any>;
}

export interface factory {
  <dependencies extends stores, componentProps extends Partial<props>>(
    constructor: (props: componentProps, options: options<componentProps, dependencies>) => dependencies,
    render: (props: componentProps, dependencies: dependencies, options: options<componentProps, dependencies>) => result,
  ): (props: componentProps, instance: ComponentInstance) => result;
}

const factory: factory = <componentProps extends Partial<props>, dependencies extends stores>(
  constructor: (props: componentProps, options: options<componentProps, dependencies>) => dependencies,
  render: (props: componentProps, dependencies: dependencies, options: options<componentProps, dependencies>) => result,
) => {
  return (props: componentProps, instance: ComponentInstance) => {
    instance.setComponentParts(constructor, render as any);

    return {
      type: instance.type,
      props: instance.props,
    } as plusnew.JSX.Element;
  };
};

export default factory;
