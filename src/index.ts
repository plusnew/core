import store, { Observer, storeType } from './util/store';
import context from './components/context';
import AbstractClass from './components/AbstractClass';
import componentFactory, { ComponentContainer } from './components/factory';
import Animate from './components/Animate';
import Portal from './components/Portal';
import Idle from './components/Idle';
import Async from './components/Async';
import Try from './components/Try';
import factory from './instances/factory';
import Instance from './instances/types/Instance';
import RootInstance from './instances/types/Root/Instance';
import { renderOptions } from './interfaces/renderOptions';
import './interfaces/jsx';
import PlusnewAbstractElement, { PlusnewElement } from './PlusnewAbstractElement';
import elementTypeChecker from './util/elementTypeChecker';
import { Fragment } from './util/symbols';
import { ApplicationElement } from './interfaces/component';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement<element extends keyof plusnew.JSX.IntrinsicElements>(type: element, props: plusnew.JSX.IntrinsicElements[element], ...children: ApplicationElement[]):
    PlusnewAbstractElement;
  public createElement<props>(type: number, props: null, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement<props>(type: Symbol, props: null, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement<props>(type: ComponentContainer<props>, props: props, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement(type: PlusnewElement, props: any, ...children: ApplicationElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  public render(element: PlusnewAbstractElement, containerElement: HTMLElement, options?: renderOptions) {
    // Fake RootInstance
    const predecessor = () => null;
    const renderOptions = options || {};
    const wrapper = new RootInstance(true, undefined, predecessor, renderOptions);

    wrapper.ref = containerElement;

    while (containerElement.childNodes.length) {
      containerElement.removeChild(containerElement.childNodes[0]);
    }

    const instance = factory(element, wrapper, predecessor, renderOptions);
    instance.initialiseNestedElements();

    return instance;
  }

  Fragment = Fragment;

}

export {
  store,
  context,
  Plusnew,
  Instance,
  componentFactory as component,
  ComponentContainer,
  renderOptions,
  PlusnewAbstractElement,
  ApplicationElement,
  elementTypeChecker,
  Portal,
  Idle,
  Animate,
  Async,
  Try,
  AbstractClass as Component,
  Observer as Props,
  Observer,
  storeType,
};

export default new Plusnew();
