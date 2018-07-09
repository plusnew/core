import plusnew, { component, store, InputEvent } from 'index';

describe('firing input events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is onchange called on text', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: InputEvent) => {
      local.dispatch(evt.target.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => ({ local }),
      (props: {}, { local }) => <input onchange={change} value={local.state} />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.state).toBe('bar');

    input.value = 'barbar';
    const eventTwo = new CustomEvent('change', { detail: { target: input } });
    input.dispatchEvent(eventTwo);

    expect(change.calls.count()).toEqual(2);
    expect(change).toHaveBeenCalledWith(eventTwo);
    expect(local.state).toBe('barbar');
  });

  it('is onchange called on explicit text', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('changex', (evt: InputEvent) => {
      local.dispatch(evt.target.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => ({ local }),
      (props: {}, { local }) => <input onchange={change} value={local.state}  />,
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
    expect(local.state).toBe('barbar');
  });

  it('is onchange called on checkbox', () => {
    const local = store(true, (state, newValue: boolean) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent) => {
      local.dispatch((evt.target as HTMLInputElement).checked);
    }).and.callThrough();

    const Component = component(
      'Component',
      () => ({ local }),
      (props: {}, { local }) => <input onchange={change} checked={local.state} type="checkbox" />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    input.checked = false;
    const event = new Event('change');
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.state).toBe(false);
  });

  it('checkbox value persists when state isnt changed', () => {
    const Component = component(
      'Component',
      () => ({}),
      (props: {}) => <input checked={false} type="checkbox" />,
    );

    plusnew.render(<Component />, container);

    const input = container.childNodes[0] as HTMLInputElement;
    const event = new Event('change');
    input.dispatchEvent(event);

    expect((container.childNodes[0] as HTMLInputElement).checked).toBe(false);
  });
});
