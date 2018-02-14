import { store as storeType } from 'redchain';
import plusnew, { store, component } from 'index';

describe('rendering the elements', () => {
  let container: HTMLElement;
  let local: storeType<string, string>;
  beforeEach(() => {
    local = store('foo', (previousState: string, newValue: string) => newValue);

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('does a value change with store', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) => <div className={local.state}>{local.state}</div>,
    );

    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');
    expect(textElement.textContent).toBe('foo');

    local.dispatch('bar');

    expect(target.className).toBe('bar');
    expect(target.innerHTML).toBe('bar');
    expect(textElement).toBe(textElement);
  });

  it('with the same values, all objects should be the same', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) => <div className={local.state}>{local.state}</div>,
    );

    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(textElement.textContent).toBe('foo');

    local.dispatch('foo');

    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');
    expect(textElement).toBe(textElement);
  });

  it('does a value change with store with JSX.Element to string', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) =>
        local.state === 'foo' ? (
          <div>
            <span>{local.state}</span>
          </div>
        ) : (
          <div>{local.state}</div>
        ),
    );

    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.childNodes[0].nodeName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('foo');

    local.dispatch('bar');

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('bar');
  });

  it('does a value change with store with string to JSX.Element', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) =>
        local.state === 'foo' ? (
          <div>{local.state}</div>
        ) : (
          <div>
            <span>{local.state}</span>
          </div>
        ),
    );

    plusnew.render(Component, container);

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo');

    local.dispatch('bar');

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.childNodes[0].nodeName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('bar');
  });

  it('does a value change with store with string to JSX.Element[]', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) =>
        local.state === 'foo' ? (
          <span>{local.state}</span>
        ) : (
          <span>
            <div>{local.state}</div>
            <span>{local.state}</span>
          </span>
        ),
    );

    plusnew.render(Component, container);

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo');

    local.dispatch('bar');

    expect(container.childNodes[0].childNodes.length).toBe(2);
    const target = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('bar');

    const targetSecond = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(targetSecond.nodeName).toBe('SPAN');
    expect(targetSecond.innerHTML).toBe('bar');
  });

  it('does a value change with store with JSX.Element[] to string', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) =>
        local.state === 'foo' ? (
          <span>{[<div>{local.state}</div>, <span>{local.state}</span>]}</span>
        ) : (
          <span>{local.state}</span>
        ),
    );

    plusnew.render(Component, container);

    expect(container.childNodes[0].childNodes.length).toBe(2);
    const target = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('foo');

    const targetSecond = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(targetSecond.nodeName).toBe('SPAN');
    expect(targetSecond.innerHTML).toBe('foo');
    local.dispatch('bar');

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('bar');
  });

  it('does a value change with store with JSX.Element to null', () => {
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) =>
        local.state === 'foo' ? (
          <div>foo</div>
        ) : (
          null
        ),
    );

    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('foo');

    local.dispatch('bar');
    expect(container.childNodes.length).toBe(0);
  });

  it('nested text-elements creation of not previously existing element', () => {
    const local = store(true, (previousState, action: boolean) => action);
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) => (local.state === true ? <div /> : <div>foo</div>),
    );

    plusnew.render(Component, container);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('');

    local.dispatch(false);

    const targetSecond = container.childNodes[0] as HTMLElement;
    expect(targetSecond.nodeName).toBe('DIV');
    expect(targetSecond.innerHTML).toBe('foo');
  });

  it('conditional rendering - inclduing correct ordering', () => {
    const local = store(false, (previousState, action: boolean) => action);
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) => (
        <div>
          <span />
          {local.state && 'foo'}
          <span />
        </div>
      ),
    );
    plusnew.render(Component, container);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');

    expect(target.childNodes.length).toBe(2);
    expect(target.childNodes[0].nodeName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('');
    expect(target.childNodes[1].nodeName).toBe('SPAN');
    expect((target.childNodes[1] as HTMLElement).innerHTML).toBe('');

    local.dispatch(true);

    expect(target.childNodes.length).toBe(3);
    expect(target.childNodes[0].nodeName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('');
    expect(target.childNodes[1].nodeName).toBe('#text');
    expect((target.childNodes[1] as Text).textContent).toBe('foo');
    expect(target.childNodes[2].nodeName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('');
  });

  it('placeholder rendering - update', () => {
    const local = store(0, (previousState, action: null) => previousState + 1);
    const Component = component(
      () => ({ local }),
      (props: {}, { local }) => (
        <div>
          {false}
          {local.state}
        </div>
      ),
    );
    plusnew.render(Component, container);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.innerHTML).toBe('0');

    local.dispatch(null);

    expect(target.innerHTML).toBe('1');
  });
});
