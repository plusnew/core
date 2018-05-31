import Instance from '../instances/types/Component/Instance';
import factory, { Component } from './factory';

type props = {
  elementDidMount?: (element: Element) => void;
  elementWillUnmount?: (element: Element) => Promise<any>;
  children: any,
};

const Portal: Component<props> = factory(
  'Animate',
  () => ({}),
  (props: props, dependencies, config) => {
    config.instance.elementDidMount = (element: Element) => {
      if (config.instance.parentInstance) {
        config.instance.parentInstance.elementDidMount(element);
      }
      if (props.elementDidMount) {
        props.elementDidMount(element);
      }
    };

    config.instance.elementWillUnmount = (element: Element): Promise<any> | void => {
      let parentWait: void | Promise<any> = undefined;
      if (config.instance.parentInstance) {
        parentWait = config.instance.parentInstance.elementWillUnmount(element);
      }

      if (parentWait) {
        if (props.elementWillUnmount) {
          return new Promise((resolve) => {
            (parentWait as Promise<any>).then(() => {
              if (props.elementWillUnmount) {
                props.elementWillUnmount(element).then(() => resolve());
              } else {
                resolve();
              }
            });
          });
        }
        return parentWait;
      }

      if (props.elementWillUnmount) {
        return props.elementWillUnmount(element);
      }
    };

    return props.children as any;
  },
);

export default Portal;

export { Instance, props };
