import Plusnew from 'index';

describe('rendering the elements', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;
  beforeEach(() => {
    plusnew = new Plusnew();
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('check if element is inserted', () => {
    const component = () => () => plusnew.createElement('div', { className: 'foo' });
    plusnew.render(component, container);
    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
  });
});
