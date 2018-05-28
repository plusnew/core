import Instance from '../instances/types/Component/Instance';
import factory, { Component } from './factory';

type props = {
  target: HTMLElement;
  children: any,
};

const Portal: Component<props> = factory(
  'Portal',
  (props: props, config) => {
    config.instance.appendChild = (element: Node, predecessor: Node | null) => {
      props.target.insertBefore(element, predecessor);
      return config.instance;
    };

    config.instance.getPredecessor = () => null;

    return {};
  },
  (props: props) => props.children as any,
);

export default Portal;

export { Instance, props };
