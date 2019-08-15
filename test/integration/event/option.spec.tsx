import plusnew, { component, store } from 'index';
import driver from '../../driver';

describe('firing onchange events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is onchange called on select, without revert', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <select onchange={change} value={state}>
            <option value="foo">Foo</option>
            <option value="bar">Bar</option>
          </select>
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const select = container.childNodes[0] as HTMLSelectElement;

    select.value = 'bar';
    const event = new CustomEvent('change', { detail: { target: select } });
    select.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('bar');
    expect(select.value).toBe('bar');
  });

  it('throws exception when no select parent is found', () => {
    const Component = component(
      'Component',
      () =>
        <option />,
    );

    expect(() => {
      plusnew.render(<Component />, { driver: driver(container) });
    }).toThrow(new Error('Could not find SELECT-ELEMENT of OPTION'));
  });

  it('throw exception when the nearest dom is not an option', () => {
    const Component = component(
      'Component',
      () =>
        <select value="foo">
          <div>
            <option />
          </div>
        </select>,
    );

    expect(() => {
      plusnew.render(<Component />, { driver: driver(container) });
    }).toThrow(new Error('Nearest dom of OPTION is not a SELECT but a DIV'));
  });

  it('async option has to work', () => {
    const local = store('bar', (_state, newValue: string) => newValue);
    const showOption = store(false);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <select onchange={change} value={state}>
            <option value="foo">Foo</option>
            <showOption.Observer>{showState => showState &&
              <>
                <option value="bar">Bar</option>
                <option value="baz">Baz</option>
              </>
            }</showOption.Observer>
          </select>
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const select = container.childNodes[0] as HTMLSelectElement;

    expect(change.calls.count()).toEqual(0);
    expect(select.value).toBe('foo');

    showOption.dispatch(true);

    expect(change.calls.count()).toEqual(0);
    expect(select.value).toBe('bar');
  });

  it('is onchange called on select, with revert', () => {
    const local = store('foo', (state, newValue: string) => state);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <select onchange={change} value={state}>
            <option value="foo">Foo</option>
            <option value="bar">Bar</option>
          </select>
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const select = container.childNodes[0] as HTMLSelectElement;

    select.value = 'bar';
    const event = new CustomEvent('change', { detail: { target: select } });
    select.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('foo');
    expect(select.value).toBe('foo');
  });

  it('initial value of option', () => {

    const Component = component(
      'Component',
      () =>
        <select onchange={() => null} value="bar" >
          <option value="foo">Foo</option>
          <option value="bar">Bar</option>
        </select>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const select = container.childNodes[0] as HTMLSelectElement;

    expect(select.value).toBe('bar');
  });
});
