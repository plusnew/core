import component from './interfaces/component';
import Element from './Element';

class Plusnew {
  createElement(type: string | component<any>, props: any, ...children: Element[]) {
    return new Element(type, props, children);
  }

  mount(component: component<{}>, element: HTMLElement) {
    const result = component({});
    // const jsx = result.render();
    // element.appendChild()
    return result;
  }
}

export default Plusnew;
