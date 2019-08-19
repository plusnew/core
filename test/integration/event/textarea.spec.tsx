import plusnew, { component, store } from 'index';
import driver from '@plusnew/driver-dom';

describe('firing onchange events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is onchange called on textarea, without revert', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <textarea onchange={change} value={state} />
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const textarea = container.childNodes[0] as HTMLTextAreaElement;

    textarea.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: textarea } });
    textarea.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('bar');
    expect(textarea.value).toBe('bar');
  });

  it('is onchange called on textarea, with revert', () => {
    const local = store('foo', (state, newValue: string) => state);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <textarea onchange={change} value={state} />
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const textarea = container.childNodes[0] as HTMLTextAreaElement;

    textarea.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: textarea } });
    textarea.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('foo');
    expect(textarea.value).toBe('foo');
  });
});
