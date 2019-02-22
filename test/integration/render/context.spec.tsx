import plusnew, { component, context } from 'index';

describe('context', () => {

  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  describe('container element uses provider and nested component consumes it', () => {
    const value = context(0, (state, action: number) => state + action);

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
    expect(container.innerHTML).toBe('0');

  });
});
