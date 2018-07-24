import Instance from '../instances/types/Component/Instance';
import factory, { ComponentContainer } from './factory';

type props = {
  target: HTMLElement;
  children: any,
};

const Portal: ComponentContainer<props> = factory(
  'Portal',
  (props: props, instance) => {
    instance.appendChild = (element: Node, predecessor: Node | null) => {
      props.target.insertBefore(element, predecessor);
    };

    instance.getPredecessor = () => null;

    return props.children;
  },
);

export default Portal;

export { Instance, props };
