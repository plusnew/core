import Instance from '../instances/types/Component/Instance';
import factory, { Component } from './factory';

type props = {
  target: HTMLElement;
  children: any,
};

const Portal: Component<props> = factory(
  'Portal',
  (props: props, config) => {
    config.instance.appendChild = (element: Node, index: number) => {
      props.target.insertBefore(element, props.target.childNodes[index]);
      return config.instance;
    };

    config.instance.previousAbstractSiblingCount = () => 0;

    return {};
  },
  (props: props) => props.children as any,
);

export default Portal;

export { Instance, props };
