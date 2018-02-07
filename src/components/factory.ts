import ComponentInstance from '../instances/types/Component/Instance';

export type result = JSX.Element | null;

export interface factory {
  <dependencies, props>(constructor: () => dependencies, render: (props: props, dependencies: dependencies) => result): (props: props, instance: ComponentInstance) => result;
}

const factory: factory = <props, dependencies>(dependencies: () => dependencies, render: (props: props, dependencies: dependencies) => result) => {
  return (props: props, instance: ComponentInstance) => {
    instance.registerDependencies(dependencies() as any);
    instance.registerRender(render as any);

    return instance.abstractElement;
  };
};

export default factory;
