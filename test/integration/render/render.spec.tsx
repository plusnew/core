import plusnew, { store, component } from 'index';

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
    const Component = component(() => ({}), (props: {}, {}) => <div className="foo" />);
    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
  });

  it('check if elements are inserted', () => {
    const Component = component(
      () => ({}),
      (props: {}, {}) => (
        <div>
          <div className="foo" />
          <span className="bar" />
        </div>
      ),
    );
    plusnew.render(<Component />, container);

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
      () => ({}),
      (props: {}, {}) => (
        <div className="foo">
          <span className="bar" />
        </div>
      ),
    );
    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('<span class="bar"></span>');
  });

  it('check if textnode is created on root', () => {
    const Component = component(() => ({}), () => 'foo' as any);

    plusnew.render(<Component />, container);
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('foo');
  });

  it('check if textnode is created on root, even with number', () => {
    const Component = component(() => ({}), () => 1 as any);

    plusnew.render(<Component />, container);
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('1');
  });

  it('check if textnode is created', () => {
    const Component = component(() => ({}), (props: {}, {}) => <div className="foo">bar</div>);
    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('bar');
  });

  it('check if null is created on root', () => {
    const Component = component(() => ({}), (props: {}, {}) => null);
    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('check if undefined is created on root', () => {
    const Component = component(() => ({}), () => undefined as any);

    plusnew.render(<Component />, container);
    expect(container.childNodes.length).toBe(0);
  });

  it('check if true is created on root', () => {
    const Component = component(() => ({ local }), () => true as any);

    plusnew.render(<Component />, container);
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('check if false is created on root', () => {
    const Component = component(() => ({ local }), () => false as any);

    plusnew.render(<Component />, container);
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });
});
