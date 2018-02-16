import component from './interfaces/component';
import PlusnewAbstractElement from './PlusnewAbstractElement';
import factory from './instances/factory';
import componentFactory from './components/factory';
import RootInstance from './instances/types/Root/Instance';
import InputEvent from './interfaces/InputEvent';
import Instance from './instances/types/Instance';
import store from 'redchain';
import './interfaces/jsx';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement(type: string | number | component<any>, props: any, ...children: PlusnewAbstractElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  public render(element: PlusnewAbstractElement, containerElement: HTMLElement) {
    // Fake RootInstance
    const wrapper = new RootInstance(element, undefined, () => 0);
    wrapper.ref = containerElement;

    while (containerElement.childNodes.length) {
      containerElement.removeChild(containerElement.childNodes[0]);
    }

    return factory(element, wrapper, () => 0);
  }
}

export { store, Plusnew, Instance, componentFactory as component, InputEvent };

export default new Plusnew();

