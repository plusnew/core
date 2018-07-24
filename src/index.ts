import store, { Consumer, store as storeType } from './util/store';
import Animate from './components/Animate';
import AbstractClass from './components/AbstractClass';
import componentFactory, { ComponentContainer } from './components/factory';
import Portal from './components/Portal';
import factory from './instances/factory';
import Instance from './instances/types/Instance';
import RootInstance, { renderOptions } from './instances/types/Root/Instance';
import InputEvent, { nothing } from './interfaces/InputEvent';
import './interfaces/jsx';
import PlusnewAbstractElement, { PlusnewElement } from './PlusnewAbstractElement';
import elementTypeChecker from './util/elementTypeChecker';
import { Fragment } from './util/symbols';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement(type: PlusnewElement, props: any, ...children: PlusnewAbstractElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  public render(element: PlusnewAbstractElement, containerElement: HTMLElement, options?: renderOptions) {
    // Fake RootInstance
    const predecessor = () => null;
    const wrapper = new RootInstance(true, undefined, predecessor, options);

    wrapper.ref = containerElement;

    while (containerElement.childNodes.length) {
      containerElement.removeChild(containerElement.childNodes[0]);
    }

    return factory(element, wrapper, predecessor);
  }

  Fragment = Fragment;
}

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
nothing;

export {
  store,
  Plusnew,
  Instance,
  componentFactory as component,
  InputEvent,
  ComponentContainer,
  renderOptions,
  PlusnewAbstractElement,
  elementTypeChecker,
  Portal,
  Animate,
  AbstractClass as Component,
  Consumer,
  storeType,
};

export default new Plusnew();
