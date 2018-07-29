import plusnew, { Props } from 'index';
import Instance from '../instances/types/Component/Instance';
import factory, { ComponentContainer } from './factory';

type props = {
  elementDidMount?: (element: Element) => void;
  elementWillUnmount?: (element: Element) => Promise<any> | void;
  children: any,
};

const Animate: ComponentContainer<props> = factory(
  'Animate',
  (Props: Props<props>, instance) => {
    return <Props render={(props) => {
      instance.elementDidMount = (element: Element) => {
        (instance.parentInstance as Instance<props>).elementDidMount(element);
        if (props.elementDidMount) {
          props.elementDidMount(element);
        }
      };

      instance.elementWillUnmount = (element: Element): Promise<any> | void => {
        let parentWait: void | Promise<any> = undefined;
        parentWait = (instance.parentInstance as Instance<props>).elementWillUnmount(element);

        if (parentWait) {
          return new Promise((resolve) => {
            (parentWait as Promise<any>).then(() => {
              if (instance.props.state.elementWillUnmount) {
                // @FIXME the as Promise seems to be wrong, a typeguard is probably needed
                (instance.props.state.elementWillUnmount(element) as Promise<any>).then(() => resolve());
              } else {
                resolve();
              }
            });
          });
        }

        if (instance.props.state.elementWillUnmount) {
          return instance.props.state.elementWillUnmount(element);
        }
      };

      return props.children;
    }} />;
  },
);

export default Animate;

export { Instance, props };
