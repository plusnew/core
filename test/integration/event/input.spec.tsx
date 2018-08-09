import plusnew, { component, store, KeyboardEvent } from 'index';

describe('firing input events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is onchange called on text', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent<HTMLInputElement>) => {
      local.dispatch(evt.target.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer render={state => <input onchange={change} value={state} /> } />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getCurrentState()).toBe('bar');

    input.value = 'barbar';
    const eventTwo = new CustomEvent('change', { detail: { target: input } });
    input.dispatchEvent(eventTwo);

    expect(change.calls.count()).toEqual(2);
    expect(change).toHaveBeenCalledWith(eventTwo);
    expect(local.getCurrentState()).toBe('barbar');
  });

  it('is onchange called on explicit text', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('changex', (evt: KeyboardEvent<HTMLInputElement>) => {
      local.dispatch(evt.target.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer render={state => <input onchange={change} value={state}  />} />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);

    input.value = 'barbar';
    const eventTwo = new CustomEvent('change', { detail: { target: input } });
    input.dispatchEvent(eventTwo);

    expect(change.calls.count()).toEqual(2);
    expect(change).toHaveBeenCalledWith(eventTwo);
    expect(local.getCurrentState()).toBe('barbar');
  });

  it('is onchange called on checkbox', () => {
    const local = store(true, (state, newValue: boolean) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent<HTMLInputElement>) => {
      local.dispatch(evt.target.checked);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => <local.Observer render={state => <input onchange={change} checked={state} type="checkbox" />} />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.checked = false;
    const event = new Event('change');
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getCurrentState()).toBe(false);
  });

  it('checkbox value persists when state isnt changed', () => {
    const Component = component(
      'Component',
      () => <input checked={false} type="checkbox" />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.checked = true;
    const event = new Event('change');
    input.dispatchEvent(event);

    expect((container.childNodes[0] as HTMLInputElement).checked).toBe(false);
  });
});
