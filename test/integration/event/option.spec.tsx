import plusnew, { component, store } from 'index';

describe('firing onchange events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is onchange called on select', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <select onchange={change} value={state} >
            <option value="foo">Foo</option>
            <option value="bar">Bar</option>
          </select>
        }</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const select = container.childNodes[0] as HTMLSelectElement;

    select.value = 'bar';
    const event = new CustomEvent('change', { detail: { target: select } });
    select.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('bar');
    expect(select.value).toBe('bar');
  });

  it('is onchange called on select', () => {
    const local = store('foo', (state, newValue: string) => state);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <select onchange={change} value={state} >
            <option value="foo">Foo</option>
            <option value="bar">Bar</option>
          </select>
        }</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const select = container.childNodes[0] as HTMLSelectElement;

    select.value = 'bar';
    const event = new CustomEvent('change', { detail: { target: select } });
    select.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('foo');
    expect(select.value).toBe('foo');
  });
});
