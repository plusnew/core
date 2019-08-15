import plusnew, { component, store } from 'index';
import driver from '../../driver';

describe('firing input events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('is oninput called on radio, without revert', () => {
    const local = store('foo', (state, newValue: string) => newValue);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <>
            <input
              onchange={change}
              type="radio"
              value="foo"
              checked={state === 'foo'}
            >Foo</input>
            <input
              onchange={change}
              type="radio"
              value="bar"
              checked={state === 'bar'}
            >Bar</input>
          </>
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const [firstRadio, secondRadio] = container.childNodes as NodeListOf<HTMLInputElement>;

    expect(firstRadio.checked).toBe(true);
    expect(secondRadio.checked).toBe(false);

    secondRadio.checked = true;
    const event = new CustomEvent('input', { detail: { target: secondRadio } });
    secondRadio.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('bar');
    expect(firstRadio.checked).toBe(false);
    expect(secondRadio.checked).toBe(true);
  });

  it('is oninput called on radio, with revert', () => {
    const local = store('foo', (state, newValue: string) => state);

    const change = jasmine.createSpy('change', (evt: KeyboardEvent & { currentTarget: HTMLInputElement}) => {
      local.dispatch(evt.currentTarget.value);
    }).and.callThrough();

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <>
            <input
              onchange={change}
              type="radio"
              value="foo"
              checked={state === 'foo'}
            >Foo</input>
            <input
              onchange={change}
              type="radio"
              value="bar"
              checked={state === 'bar'}
            >Bar</input>
          </>
        }</local.Observer>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const [firstRadio, secondRadio] = container.childNodes as NodeListOf<HTMLInputElement>;

    expect(firstRadio.checked).toBe(true);
    expect(secondRadio.checked).toBe(false);

    secondRadio.checked = true;
    const event = new CustomEvent('input', { detail: { target: secondRadio } });
    secondRadio.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
    expect(local.getState()).toBe('foo');
    expect(firstRadio.checked).toBe(true);
    expect(secondRadio.checked).toBe(false);
  });
});
