import component from './interfaces/component';

class Plusnew {
  createElement(type: string, props: any) {
    
  }

  mount(component: component<{}>, element: HTMLElement) {
    const result = component({});
    // const jsx = result.render();
    // element.appendChild()
    return result;
  }
}

export default Plusnew;
