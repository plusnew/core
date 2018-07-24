import Instance from '../instances/types/Component/Instance';
import factory, { ComponentContainer } from './factory';

type props = {
  elementDidMount?: (element: Element) => void;
  elementWillUnmount?: (element: Element) => Promise<any> | void;
  children: any,
};

const Animate: ComponentContainer<props> = factory(
  'Animate',
  () => ({}),
  (props: props, _dependencies, config) => {
    config.instance.elementDidMount = (element: Element) => {
      (config.instance.parentInstance as Instance).elementDidMount(element);
      if (props.elementDidMount) {
        props.elementDidMount(element);
      }
    };

    config.instance.elementWillUnmount = (element: Element): Promise<any> | void => {
      let parentWait: void | Promise<any> = undefined;
      parentWait = (config.instance.parentInstance as Instance).elementWillUnmount(element);

      if (parentWait) {
        return new Promise((resolve) => {
          (parentWait as Promise<any>).then(() => {
            if (config.instance.props.elementWillUnmount) {
              config.instance.props.elementWillUnmount(element).then(() => resolve());
            } else {
              resolve();
            }
          });
        });
      }

      if (config.instance.props.elementWillUnmount) {
        return config.instance.props.elementWillUnmount(element);
      }
    };

    return props.children as any;
  },
);

export default Animate;

export { Instance, props };
