import plusnew, { component, Try, store } from 'index';

describe('<Try />', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('Show error message when something went wrong', () => {
    const counter = store(0);

    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={() => <div>{counterState}</div>}
          >
            {() => { throw new Error('error'); }}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show children when everything went okay', () => {
    const counter = store(0);
    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={() => <div>{counterState}</div>}
          >
            {() => <span>{counterState}</span>}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show children and then error', () => {
    const counter = store(0);
    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={() => <div>{counterState}</div>}
          >
            {() => {
              if (counterState === 0) {
                return <span>{counterState}</span>;
              }
              throw new Error('error');
            }}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show children and then error when at observer something went wrong', () => {
    const counter = store(0);
    const Component = component(
      'Component',
      () =>
        <Try
          catch={() => <div></div>}
        >
          {() =>
            <counter.Observer>{(counterState) => {
              if (counterState === 0) {
                return <span>{counterState}</span>;
              }
              throw new Error('error');
            }}</counter.Observer>
          }
        </Try>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('Use try catch and then dont', () => {
    const counter = store(0);

    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          counterState === 0 && <Try
            catch={() => <div>{counterState}</div>}
          >
            {() => <span>{counterState}</span>}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(container.childNodes.length).toBe(0);
  });

  it('Show children and then updated children', () => {
    const counter = store(0);
    const Component = component(
      'Component',
      () =>
        <Try
          catch={() => <div></div>}
        >
          {() =>
            <counter.Observer>{counterState =>
                <span>{counterState}</span>
            }</counter.Observer>
          }
        </Try>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show error and then still error, when props change', () => {
    const counter = store(0);
    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={() => <div>{counterState}</div>}
          >
            {() => {
              if (counterState === 1) {
                return <span>{counterState}</span>;
              }
              throw new Error('error');
            }}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show error when in nested component something went wrong', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => {
        throw new Error('error');
      },
    );

    const Component = component(
      'Component',
      () =>
        <Try
          catch={() => <div />}
        >
          {() => <NestedComponent />}
        </Try>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('Show error when in nested component something went wrong', () => {
    const counter = store(0);
    const NestedComponent = component(
      'NestedComponent',
      () =>
        <counter.Observer>{(counterState) => {
          if (counterState === 0) {
            return <span>{counterState}</span>;
          }
          throw new Error('error');
        }}</counter.Observer>,
    );

    const Component = component(
      'Component',
      () =>
        <Try
          catch={() => <div />}
        >
          {() => <NestedComponent />}
        </Try>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });
});
