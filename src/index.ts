import component from './interfaces/component';
import PlusnewAbstractElement from './PlusnewAbstractElement';
import ComponentHandler from './ComponentHandler';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  createElement(type: string | component<any>, props: any, ...children: PlusnewAbstractElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  render(component: component<{}>, element: HTMLElement) {
    const componentHandler = new ComponentHandler(component, {});
    componentHandler.domHandler.removeChildren(element);
    componentHandler.domHandler.mount(element);

    return componentHandler;
  }
}

export default Plusnew;
