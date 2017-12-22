import Plusnew from 'index';
import component from 'interfaces/component';

describe('rendering nested components', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;

  beforeEach(() => {
    plusnew = new Plusnew();

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('does a initial list work, with pushing values', () => {
    const change = jasmine.createSpy('change');
    const component: component<{}, {}> = () => {
      return {
        render: () => <input onchange={change} value="bar"/>,
        dependencies: {},
      };
    };

    plusnew.render(component, container);

    const input = document.getElementsByTagName('input')[0];
    input.value = 'foo';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
  });
});
