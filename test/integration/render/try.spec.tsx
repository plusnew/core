import plusnew, { component, Try, store, context, Async } from 'index';
import driver from '@plusnew/driver-dom/src/driver';
import '@plusnew/driver-dom/src/jsx';

function tick() {
  return Promise.resolve();
}

describe('<Try />', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('Show error message when something went wrong', () => {
    const counter = store(0);
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={catchSpy.and.callFake(() => <div>{counterState}</div>)}
          >
            {() => { throw error; }}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(catchSpy).toHaveBeenCalledWith(error);
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

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show children and then error', () => {
    const counter = store(0);
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={catchSpy.and.callFake(() => <div>{counterState}</div>)}
          >
            {() => {
              if (counterState === 0) {
                return <span>{counterState}</span>;
              }
              throw error;
            }}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(catchSpy).toHaveBeenCalledWith(error);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show children and then error when at observer something went wrong', () => {
    const counter = store(0);
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const Component = component(
      'Component',
      () =>
        <Try
          catch={catchSpy.and.callFake(() => <div></div>)}
        >
          {() =>
            <counter.Observer>{(counterState) => {
              if (counterState === 0) {
                return <span>{counterState}</span>;
              }
              throw error;
            }}</counter.Observer>
          }
        </Try>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(catchSpy).toHaveBeenCalledWith(error);
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

    plusnew.render(<Component />, { driver: driver(container) });

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

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show error and then still error, when props change', () => {
    const counter = store(0);
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const Component = component(
      'Component',
      () =>
        <counter.Observer>{counterState =>
          <Try
            catch={catchSpy.and.callFake(() => <div>{counterState}</div>)}
          >
            {() => {
              if (counterState === 1) {
                return <span>{counterState}</span>;
              }
              throw error;
            }}
          </Try>
        }</counter.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(catchSpy).toHaveBeenCalledWith(error);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });

  it('Show error when in nested component something went wrong', () => {
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const NestedComponent = component(
      'NestedComponent',
      () => {
        throw error;
      },
    );

    const Component = component(
      'Component',
      () =>
        <Try
          catch={catchSpy.and.callFake(() => <div />)}
        >
          {() => <NestedComponent />}
        </Try>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(catchSpy).toHaveBeenCalledWith(error);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('Show error when in deeply nested component something went wrong', () => {
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const NestedComponent = component(
      'NestedComponent',
      () =>
        <>
          <span />
          <DeeplyNestedComponent />
          <span />
        </>,
    );

    const DeeplyNestedComponent = component(
      'DeepldyNestedComponent',
      () => {
        throw error;
      },
    );

    const Component = component(
      'Component',
      () =>
        <Try
          catch={catchSpy.and.callFake(() => <div />)}
        >{() =>
          <NestedComponent />
          }</Try>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(catchSpy).toHaveBeenCalledWith(error);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('Show error when in nested component something went wrong', () => {
    const counter = store(0);
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const NestedComponent = component(
      'NestedComponent',
      () =>
        <counter.Observer>{(counterState) => {
          if (counterState === 0) {
            return <span>{counterState}</span>;
          }
          throw error;
        }}</counter.Observer>,
    );

    const Component = component(
      'Component',
      () =>
        <Try
          catch={catchSpy.and.callFake(() => <div />)}
        >
          {() => <NestedComponent />}
        </Try>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(catchSpy).toHaveBeenCalledWith(error);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('Show error when in deeply nested component something went wrong', () => {
    const counter = store(0);
    const error = new Error('error');
    const catchSpy = jasmine.createSpy('catchSpy');

    const Component = component(
      'Component',
      () =>
        <Try
          catch={catchSpy.and.callFake(() => <div />)}
        >
          {() => <NestedComponent />}
        </Try>,
    );

    const NestedComponent = component(
      'NestedComponent',
      () =>
        <counter.Observer>{(counterState) => {
          if (counterState === 0) {
            return <span>{counterState}</span>;
          }
          return <DeeplyNestedComponent />;
        }}</counter.Observer>,
    );

    const DeeplyNestedComponent = component(
      'DeepldyNestedComponent',
      () => {
        throw error;
      },
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect(catchSpy).toHaveBeenCalledWith(error);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  describe('context', () => {
    it('Show children and then error', () => {
      const counter = store(0);
      const counterContext = context<number, number>();
      const error = new Error('error');
      const catchSpy = jasmine.createSpy('catchSpy');

      const NestedComponent = component(
        'NestedComponent',
        () =>
          <counterContext.Consumer>{(counterState) => {
            if (counterState === 0) {
              return <span>{counterState}</span>;
            }
            throw error;
          }}</counterContext.Consumer>,
      );

      const Component = component(
        'Component',
        () =>
          <Try
            catch={catchSpy.and.callFake(() => <div />)}
          >
            {() =>
              <counter.Observer>{counterState =>
                <counterContext.Provider state={counterState} dispatch={counter.dispatch}>
                  <NestedComponent />
                </counterContext.Provider>
              }</counter.Observer>
            }
          </Try>,
      );

      plusnew.render(<Component />, { driver: driver(container) });

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

      counter.dispatch(1);

      expect(catchSpy).toHaveBeenCalledWith(error);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    });

    it('Show children and then error by deeply nested component', () => {
      const counter = store(0);
      const counterContext = context<number, number>();
      const error = new Error('error');
      const catchSpy = jasmine.createSpy('catchSpy');

      const Component = component(
        'Component',
        () =>

          <counter.Observer>{counterState =>
            <counterContext.Provider state={counterState} dispatch={counter.dispatch}>
              <Try
                catch={catchSpy.and.callFake(() => <div />)}
              >
                {() =>
                  <NestedComponent />
                }
              </Try>
            </counterContext.Provider>
          }</counter.Observer>,
      );

      const NestedComponent = component(
        'NestedComponent',
        () =>
          <counterContext.Consumer>{(counterState) => {
            if (counterState === 0) {
              return <span>{counterState}</span>;
            }
            return <DeeplyNestedComponent />;
          }}</counterContext.Consumer>,
      );

      const DeeplyNestedComponent = component(
        'DeepldyNestedComponent',
        () => {
          throw error;
        },
      );

      plusnew.render(<Component />, { driver: driver(container) });

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

      counter.dispatch(1);

      expect(catchSpy).toHaveBeenCalledWith(error);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    });
  });

  it('Show children and then update', () => {
    const counter = store(0);
    const counterContext = context<number, number>();

    const NestedComponent = component(
      'NestedComponent',
      () =>
        <counterContext.Consumer>{counterState =>
          <span>{counterState}</span>
        }</counterContext.Consumer>,
    );

    const Component = component(
      'Component',
      () =>
        <Try
          catch={() => <div />}
        >
          {() =>
            <counter.Observer>{counterState =>
              <counterContext.Provider state={counterState} dispatch={counter.dispatch}>
                <NestedComponent />
              </counterContext.Provider>
            }</counter.Observer>
          }
        </Try>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counter.dispatch(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
  });
  it('<Async /> reject', async () => {
    const Component = component(
      'Component',
      () =>
        <Try
          catch={() => <div />}
        >
          {() =>
            <Async
              pendingIndicator={<span />}
            >{() => Promise.reject()}</Async>
          }
        </Try>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick();
    await tick();

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });
});
