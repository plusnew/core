import Instance from '../instances/types/Component/Instance';
import factory, { Component } from './factory';

type props = {
  elementDidMount?: (element: Element) => void
  elementWillUnmount?: (element: Element) => Promise<any> | void
  children: any,
};

const Portal: Component<props> = factory(
  'Animate',
  (props: props, config) => {
    return {};
  },
  (props: props) => props.children as any,
);

export default Portal;

export { Instance, props };
