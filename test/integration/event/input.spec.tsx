import plusnew, { component, store } from 'index';

describe('firing input events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is oninput called on text', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer>{state => <input type="text" onchange={change} value={state} /> }</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('bar');

    input.value = 'barbar';
    const eventTwo = new CustomEvent('change', { detail: { target: input } });
    input.dispatchEvent(eventTwo);

    expect(change.calls.count()).toEqual(1);
  });

  it('is oninput called on number', () => {
    const local = store(0, (state, newValue: number) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(Number(evt.currentTarget.value));
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer>{state => <input type="number" onchange={change} value={`${state}`} /> }</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.value = '1';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe(1);

    const eventTwo = new CustomEvent('change', { detail: { target: input } });
    input.dispatchEvent(eventTwo);

    expect(change.calls.count()).toEqual(1);
  });

  it('is oninput called on explicit text', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('changex', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer>{state => <input type="text" onchange={change} value={state}  />}</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);

    input.value = 'barbar';
    const eventTwo = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(eventTwo);

    expect(change.calls.count()).toEqual(2);
    expect(change).toHaveBeenCalledWith(eventTwo);
    expect(local.getState()).toBe('barbar');
  });

  it('is oninput called on checkbox', () => {
    const local = store(true, (_state, newValue: boolean) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.checked);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer>{state => <input onchange={change} checked={state} type="checkbox" />}</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.checked = false;
    const event = new Event('input');
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe(false);
  });

  it('checkbox value persists when state isnt changed', () => {
    const Component = component(
      'Component',
      () => <input checked={false} type="checkbox" />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.checked = true;
    const event = new Event('input');
    input.dispatchEvent(event);

    expect((container.childNodes[0] as HTMLInputElement).checked).toBe(false);
  });

  it('checkbox updates after changing store', () => {
    const local = store(false);
    const Component = component(
      'Component',
      () => <local.Observer>{localState => <input checked={localState} type="checkbox" onchange={evt => local.dispatch(evt.currentTarget.checked)} />}</local.Observer>,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.checked = true;
    const event = new Event('input');
    input.dispatchEvent(event);

    expect((container.childNodes[0] as HTMLInputElement).checked).toBe(true);
    expect(local.getState()).toBe(true);

    local.dispatch(false);

    expect((container.childNodes[0] as HTMLInputElement).checked).toBe(false);
  });
});
