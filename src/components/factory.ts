import ComponentInstance from '../instances/types/Component/Instance';
import { store } from 'redchain';

export type result = JSX.Element | null;
export interface componentResult<props> {
  (props: props, instance: ComponentInstance): JSX.Element | null;
}

export interface stores {
  [key: string]: store<any, any>;
}

export interface factory {
  <dependencies extends stores, props>(
    constructor: (props: props) => dependencies,
    render: (props: props, dependencies: dependencies) => result,
  ): (props: props, instance: ComponentInstance) => result;
}

const factory: factory = <props, dependencies>(
  dependencies: (props: props) => dependencies,
  render: (props: props, dependencies: dependencies) => result,
) => {
  return (props: props, instance: ComponentInstance) => {
    instance.handleChildren(render as any, dependencies(props) as any);

    return instance.abstractElement;
  };
};

export default factory;
