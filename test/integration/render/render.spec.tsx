import plusnew, { Props, store, component } from 'index';
import driver from '@plusnew/driver-dom';

describe('rendering the elements', () => {
  const local = store(0, (previousState, action: undefined) => previousState + 1);
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('check if element is inserted', () => {
    const Component = component(
      'Component',
      (Props: Props<{}>) => <div className="foo" />,
    );
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
  });

  it('check if elements are inserted', () => {
    const Component = component(
      'Component',
      () => (
        <div>
          <div className="foo" />
          <span className="bar" />
        </div>
      ),
    );
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes[0].childNodes.length).toBe(2);

    const firstTarget = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(firstTarget.nodeName).toBe('DIV');
    expect(firstTarget.className).toBe('foo');

    const secondTarget = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(secondTarget.nodeName).toBe('SPAN');
    expect(secondTarget.className).toBe('bar');
  });

  it('check if nesting works', () => {
    const Component = component(
      'Component',
      () => (
        <div className="foo">
          <span className="bar" />
        </div>
      ),
    );
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('<span class="bar"></span>');
  });

  it('check if textnode is created on root', () => {
    const Component = component(
      'Component',
      () => 'foo',
    );

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('foo');
  });

  it('check if textnode is created on root, even with number', () => {
    const Component = component(
      'Component',
      () => 1,
    );

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('1');
  });

  it('check if textnode is created', () => {
    const Component = component(
      'Component',
      (Props: Props<{}>) => <div className="foo">bar</div>,
    );
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('bar');
  });

  it('check if null is created on root', () => {
    const Component = component(
      'Component',
      () => null,
    );
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('check if undefined is created on root', () => {
    const Component = component(
      'Component',
      () => undefined,
    );

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(0);
  });

  it('check if true is created on root', () => {
    const Component = component(
      'Component',
      () => true as any,
    );

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('check if false is created on root', () => {
    const Component = component(
      'Component',
      () => false as any,
    );

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('adding element afterwards', () => {
    const local = store(false);

    const MainComponent = component(
      'Component',
      () =>
        <>
          <header />
          <local.Observer>{localState => localState && <content />}</local.Observer>
          <footer />
        </>,
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('HEADER');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('FOOTER');

    local.dispatch(true);

    expect(container.childNodes.length).toBe(3);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('HEADER');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('CONTENT');
    expect((container.childNodes[2] as HTMLElement).tagName).toBe('FOOTER');
  });
});
