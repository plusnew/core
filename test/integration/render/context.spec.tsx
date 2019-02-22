import plusnew, { component, context } from 'index';

describe('context', () => {

  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  describe('container element uses provider and nested component consumes it', () => {
    const value = context(1, (state, action: number) => state + action);

    const MainComponent = component(
      'Component',
      () =>
        <value.Provider>
          <NestedComponent />
        </value.Provider>,
    );

    const NestedComponent = component(
      'Component',
      () => <value.Consumer>{state => state}</value.Consumer>,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('1');
  });

  describe('two nested consumers are using the state, one is dispatching a value and both consumers get updated', () => {
    const value = context(1, (state, action: number) => state + action);

    const MainComponent = component(
      'Component',
      () =>
        <value.Provider>
          <NestedComponent />
          <AnotherNestedComponent />
        </value.Provider>,
    );

    const NestedComponent = component(
      'Component',
      () => <div><value.Consumer>{state => state}</value.Consumer></div>,
    );

    const AnotherNestedComponent = component(
      'Component',
      () => <value.Consumer>{(state, dispatch) => <button onclick={() => dispatch(2)}>{state}</button>}</value.Consumer>,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('BUTTON');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('1');

    (container.childNodes[1] as HTMLElement).dispatchEvent(new Event('click'));

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('3');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('BUTTON');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('3');
  });
});
