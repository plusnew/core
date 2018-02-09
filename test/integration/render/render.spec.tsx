import plusnew from 'index';
import store from 'redchain';
import factory from 'components/factory';

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
    const Component = factory(() => ({}), (props: {}, {}) => <div className="foo" />);
    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
  });

  it('check if elements are inserted', () => {
    const Component = factory(
      () => ({}),
      (props: {}, {}) => (
        <div>
          <div className="foo" />
          <span className="bar" />
        </div>
      ),
    );
    plusnew.render(Component, container);

    expect(container.childNodes[0].childNodes.length).toBe(2);

    const firstTarget = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(firstTarget.nodeName).toBe('DIV');
    expect(firstTarget.className).toBe('foo');

    const secondTarget = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(secondTarget.nodeName).toBe('SPAN');
    expect(secondTarget.className).toBe('bar');
  });

  it('check if nesting works', () => {
    const Component = factory(
      () => ({}),
      (props: {}, {}) => (
        <div className="foo">
          <span className="bar" />
        </div>
      ),
    );
    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('<span class="bar"></span>');
  });

  it('check if textnode is created on root', () => {
    const component = factory(() => ({}), () => 'foo' as any);

    plusnew.render(component, container);
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('foo');
  });

  it('check if textnode is created on root, even with number', () => {
    const component = factory(() => ({}), () => 1 as any);

    plusnew.render(component, container);
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe('1');
  });

  it('check if textnode is created', () => {
    const Component = factory(() => ({}), (props: {}, {}) => <div className="foo">bar</div>);
    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('bar');
  });

  it('check if null is created on root', () => {
    const Component = factory(() => ({}), (props: {}, {}) => null);
    plusnew.render(Component, container);

    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('check if undefined is created on root', () => {
    const component = factory(() => ({}), () => undefined as any);

    plusnew.render(component, container);
    expect(container.childNodes.length).toBe(0);
  });

  it('check if true is created on root', () => {
    const component = factory(() => ({ local }), () => true as any);

    plusnew.render(component, container);
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it('check if false is created on root', () => {
    const component = factory(() => ({ local }), () => false as any);

    plusnew.render(component, container);
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });
});
