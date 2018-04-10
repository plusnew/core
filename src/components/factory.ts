import ComponentInstance from '../instances/types/Component/Instance';
import { deps, props, options } from '../interfaces/component';

export type result = plusnew.JSX.Element | null;
export interface componentResult<componentProps extends Partial<props>> {
  (props: componentProps, instance: ComponentInstance): plusnew.JSX.Element | null;
}

export interface factory {
  <dependencies extends deps, componentProps extends Partial<props>>(
    constructor: (props: componentProps) => dependencies,
    render: (props: componentProps, dependencies: dependencies) => result,
    options?: options<componentProps, dependencies>,
  ): (props: componentProps, instance: ComponentInstance) => result;
}

const factory: factory = <props extends Partial<props>, dependencies extends deps>(
  constructor: (props: props) => dependencies,
  render: (props: props, dependencies: dependencies) => result,
  options?: options<props, dependencies>,
) => {
  return (props: props, instance: ComponentInstance) => {
    instance.setComponentParts(render as any, constructor(props), options);

    return instance.abstractElement;
  };
};

export default factory;
