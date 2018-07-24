import plusnew, { Consumer } from 'index';
import Instance from '../instances/types/Component/Instance';
import factory, { ComponentContainer } from './factory';

type props = {
  target: HTMLElement;
  children: any,
};

const Portal: ComponentContainer<props> = factory(
  'Portal',
  (Props: Consumer<props>, instance) => {
    let initialised = false;

    return <Props render={(props) => {
      if (initialised === false) {
        initialised = true;
        instance.appendChild = (element: Node, predecessor: Node | null) => {
          props.target.insertBefore(element, predecessor);
        };

        instance.getPredecessor = () => null;

      }

      return props.children;
    }} />;
  },
);

export default Portal;

export { Instance, props };
