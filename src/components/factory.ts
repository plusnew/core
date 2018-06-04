import { store } from 'redchain';
import ComponentInstance from '../instances/types/Component/Instance';
import { options, props } from '../interfaces/component';

export type result = plusnew.JSX.Element | null;
export interface componentResult<componentProps extends Partial<props>> {
  (props: componentProps, instance: ComponentInstance): plusnew.JSX.Element | null;
}

export interface stores {
  [key: string]: store<any, any>;
}

export interface Component<componentProps> {
  (props: componentProps, instance: ComponentInstance): result;
  displayName: string;
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
): Component<componentProps> => {
  const Component: Component<componentProps> = ((props: componentProps, instance: ComponentInstance) => {
    instance.setComponentParts(constructor, render as any);

    return {
      type: instance.type,
      props: instance.props,
    } as plusnew.JSX.Element;
  }) as any;

  Component.displayName = displayName;

  return Component;
};

export default factory;
