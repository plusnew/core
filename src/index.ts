import store, { Observer, storeType } from './util/store';
import AbstractClass from './components/AbstractClass';
import componentFactory, { ComponentContainer } from './components/factory';
import Animate from './components/Animate';
import Portal from './components/Portal';
import Idle from './components/Idle';
import Async from './components/Async';
import factory from './instances/factory';
import Instance from './instances/types/Instance';
import RootInstance, { renderOptions } from './instances/types/Root/Instance';
import { KeyboardEvent, MouseEvent, TouchEvent, nothing } from './interfaces/Events';
import './interfaces/jsx';
import PlusnewAbstractElement, { PlusnewElement } from './PlusnewAbstractElement';
import elementTypeChecker from './util/elementTypeChecker';
import { Fragment } from './util/symbols';
import { ApplicationElement } from './interfaces/component';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement(type: PlusnewElement, props: any, ...children: ApplicationElement[]) {
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
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
  ComponentContainer,
  renderOptions,
  PlusnewAbstractElement,
  ApplicationElement,
  elementTypeChecker,
  Portal,
  Idle,
  Animate,
  Async,
  AbstractClass as Component,
  Observer as Props,
  Observer,
  storeType,
};

export default new Plusnew();
