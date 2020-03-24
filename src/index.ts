import type { ComponentContainer } from './components/factory';
import factory from './instances/factory';
import RootInstance from './instances/types/Root/Instance';
import type { ApplicationElement } from './interfaces/component';
import type { renderOptions } from './interfaces/renderOptions';
import PlusnewAbstractElement from './PlusnewAbstractElement';
import type { PlusnewElement } from './PlusnewAbstractElement';
import { Fragment } from './util/symbols';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement<element extends keyof plusnew.JSX.IntrinsicElements>(type: element, props: plusnew.JSX.IntrinsicElements[element], ...children: ApplicationElement[]):
    PlusnewAbstractElement;
  public createElement<props>(type: number, props: null, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement<props>(type: Symbol, props: null, ...children: ApplicationElement[]): PlusnewAbstractElement;
  public createElement<props>(type: ComponentContainer<props, unknown, unknown>, props: props, ...children: ApplicationElement[]): PlusnewAbstractElement;
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

export { default as Component } from './components/AbstractClass';
export { default as Async } from './components/Async';
export { default as context } from './components/context';
export { default as component } from './components/factory';
export { PortalEntrance, PortalExit } from './components/portal';
export { default as Try } from './components/Try';
export { ApplicationElement } from './interfaces/component';
export { default as store } from './util/store';
export type { Observer as Props, Store } from './util/store';
export type { ComponentContainer };

export default new Plusnew();
