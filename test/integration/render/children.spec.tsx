import plusnew, { Props, store, component } from 'index';

describe('rendering nested components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  describe('children in nested component', () => {
    it('static children', () => {
      const local = store('foo', (_state, action: string) => action);
      const NestedComponent = component(
        'Component',
        (Props: Props<{ children: any }>) => <span><Props>{props => props.children}</Props></span>,
      );

      const MainComponent = component(
        'Component',
        () => <local.Observer>{local => <NestedComponent>{local}</NestedComponent>}</local.Observer>,
      );

      plusnew.render(<MainComponent />, container);

      const nestedElement = container.childNodes[0] as HTMLElement;
      expect(container.childNodes.length).toBe(1);
      expect(nestedElement.tagName).toBe('SPAN');
      expect(nestedElement.innerHTML).toBe('foo');

      local.dispatch('bar');

      expect(nestedElement.innerHTML).toBe('bar');
    });

    it('dynamic children', () => {
      const local = store(0, (_state, action: number) => action);

      const NestedComponent = component(
        'Component',
        (Props: Props<{ children: any }>) => <span><Props>{props => props.children}</Props></span>,
      );

      const MainComponent = component(
        'Component',
        () => <NestedComponent><local.Observer>{local => local}</local.Observer></NestedComponent>,
      );

      plusnew.render(<MainComponent />, container);

      const nestedElement = container.childNodes[0] as HTMLElement;
      expect((nestedElement.childNodes[0] as Text).textContent).toBe('0');

      local.dispatch(1);

      expect((nestedElement.childNodes[0] as Text).textContent).toBe('1');
    });
  });
});
