import component from './interfaces/component';

class Plusnew {
  createElement(type: string, props: any) {
    
  }

  mount(component: component<{}, any, any>, element: HTMLElement) {
    const result = component({});
    // const jsx = result.render();
    // element.appendChild()
  }
}

export default Plusnew;
