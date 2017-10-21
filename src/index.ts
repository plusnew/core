import component from 'interfaces/component';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
import ComponentHandler from 'ComponentHandler';
import RootInstance from 'ComponentHandler/DomHandler/Instance/RootInstance';

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
  render(component: component<{}>, containerElement: HTMLElement) {
    // Fake RootInstance
    const wrapper = new RootInstance(new PlusnewAbstractElement(component, {}, []), undefined, () => 0);
    wrapper.ref = containerElement;

    while (containerElement.childNodes.length) {
      containerElement.removeChild(containerElement.childNodes[0]);
    }

    return new ComponentHandler(component, {}, wrapper, () => 0);
  }
}

export default Plusnew;
