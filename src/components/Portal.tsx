import plusnew, { Props } from '../index';
import Instance from '../instances/types/Component/Instance';
import component, { ComponentContainer } from './factory';

type props = {
  target: Element;
  children: any,
};

const Portal: ComponentContainer<props> = component(
  'Portal',
  (Props: Props<props>, instance) => {
    let initialised = false;

    // The instance should get the namespace of the target, not the namespace from the parent-instance
    instance.renderOptions.namespace = Props.getState().target.namespaceURI as string;

    return <Props>{(props) => {
      if (initialised === false) {
        initialised = true;
        instance.appendChild = (element: Node, predecessor: Node | null) => {
          props.target.insertBefore(element, predecessor);
        };

        instance.getPredecessor = () => null;
      }

      return props.children;
    }}</Props>;
  },
);

export default Portal;

export { Instance, props };
