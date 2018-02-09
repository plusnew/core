import Plusnew from 'index';
import store from 'redchain';
import factory from 'components/factory';

describe('rendering nested components', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;

  beforeEach(() => {
    plusnew = new Plusnew();

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  describe('children in nested component', () => {
    it('static children', () => {
      const local = store('foo', (state, action: string) => action);
      const NestedComponent = factory(() => ({}), (props: { children: any }) => <span>{props.children}</span>);

      const MainComponent = factory(() => ({ local }), () => <NestedComponent>{local.state}</NestedComponent>);

      plusnew.render(MainComponent, container);

      const nestedElement = container.childNodes[0] as HTMLElement;
      expect(container.childNodes.length).toBe(1);
      expect(nestedElement.tagName).toBe('SPAN');
      expect(nestedElement.innerHTML).toBe('foo');

      local.dispatch('bar');

      expect(nestedElement.innerHTML).toBe('bar');
    });
  });
});
