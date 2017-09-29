import component from './interfaces/component';
import PlusnewElement from './PlusnewElement';

class Plusnew {
  createElement(type: string | component<any>, props: any, ...children: PlusnewElement[]) {
    return new PlusnewElement(type, props, children);
  }

  render(component: component<{}>, element: HTMLElement) {
    const result = component({});
    // const jsx = result.render();
    // element.appendChild()
    return result;
  }
}

export default Plusnew;
