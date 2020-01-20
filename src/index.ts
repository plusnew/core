import AbstractClass from './components/AbstractClass';
import Async from './components/Async';
import context from './components/context';
import componentFactory, { IComponentContainer } from './components/factory';
import { PortalEntrance, PortalExit } from './components/portal';
import Try from './components/Try';
import factory from './instances/factory';
import Instance from './instances/types/Instance';
import RootInstance from './instances/types/Root/Instance';
import { ApplicationElement } from './interfaces/component';
import { renderOptions } from './interfaces/renderOptions';
import PlusnewAbstractElement, { PlusnewElement } from './PlusnewAbstractElement';
import elementTypeChecker from './util/elementTypeChecker';
import store, { Observer, storeType } from './util/store';
import { Fragment } from './util/symbols';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement<element extends keyof plusnew.JSX.IntrinsicElements>(type: element, props: plusnew.JSX.IntrinsicElements[element], ...children: ApplicationElement[]):
    PlusnewAbstractElement;
  public createElement<props>(type: number, props: null, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement<props>(type: Symbol, props: null, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement<props>(type: IComponentContainer<props, unknown, unknown>, props: props, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement(type: PlusnewElement, props: any, ...children: ApplicationElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  public render<HostElement, HostTextElement>(element: PlusnewAbstractElement, options: renderOptions<HostElement, HostTextElement>) {
    let internalOptions = options;

    if ('portals' in options === false) {
      internalOptions = {
        ...internalOptions,
        portals: {},
      };
    }

    // Fake RootInstance
    const predecessor = () => null;
    const wrapper = new RootInstance(true, undefined, predecessor, internalOptions);

    const instance = factory(element, wrapper, predecessor, internalOptions);
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
  IComponentContainer as ComponentContainer,
  renderOptions,
  PlusnewAbstractElement,
  ApplicationElement,
  elementTypeChecker,
  Async,
  Try,
  AbstractClass as Component,
  Observer as Props,
  Observer,
  storeType,
  PortalEntrance,
  PortalExit,
};

export default new Plusnew();
