import plusnew, { component, store } from 'index';

describe('dom handling', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('correct handling of acceptCharset', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <form acceptCharset="UTF-8" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLFormElement;

    expect(target.acceptCharset).toBe('UTF-8');
  });

  it('correct handling of class', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <div className="foo" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLElement;

    expect(target.className).toBe('foo');
  });

  it('correct handling of htmlFor', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <label htmlFor="foo" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLLabelElement;

    expect(target.htmlFor).toBe('foo');
  });

  it('correct handling of httpEquiv', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <meta httpEquiv="refresh" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLMetaElement;

    expect(target.httpEquiv).toBe('refresh');
  });

  it('correct handling of onclick', () => {
    const clickHandler = () => {};

    const Component = component(
      () => ({}),
      (props: {}) =>
        <span onclick={clickHandler} />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLMetaElement;

    expect(target.onclick).toBe(clickHandler);
  });


  it('replacing children of dom', () => {
    const local = store(true, (state, action: boolean) => action);
    const MainComponent = component(
      () => ({  local }),
      () =>
        local.state ?
          <div>
            <span>foo</span>
          </div>
        :
          <div>
            <span>bar</span>
            <span>baz</span>
          </div>,
    );

    plusnew.render(<MainComponent />, container);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');

    expect(container.childNodes[0].childNodes.length).toBe(1);
    expect((container.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('foo');

    local.dispatch(false);

    expect(container.childNodes[0].childNodes.length).toBe(2);
    expect((container.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('bar');
    expect((container.childNodes[0].childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0].childNodes[1] as HTMLElement).innerHTML).toBe('baz');

    local.dispatch(true);

    expect(container.childNodes[0].childNodes.length).toBe(1);
    expect((container.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('foo');
  });

  it('boolean attributes', () => {
    const local = store(true, (state, action: boolean) => action);

    const Component = component(
      () => ({ local }),
      () => <input disabled={local.state} />,
    );

    plusnew.render(<Component />, container);

    expect((container.childNodes[0] as HTMLInputElement).tagName).toBe('INPUT');
    expect((container.childNodes[0] as HTMLInputElement).disabled).toBe(local.state);

    local.dispatch(false);

    expect((container.childNodes[0] as HTMLInputElement).disabled).toBe(local.state);

    local.dispatch(true);

    expect((container.childNodes[0] as HTMLInputElement).disabled).toBe(local.state);
  });

  it('plusnew attributes', () => {
    const local = store(true, (state, action: boolean) => action);

    const Component = component(
      () => ({ local }),
      () => <div key="foo" />,
    );

    plusnew.render(<Component />, container);

    expect((container.childNodes[0] as HTMLDivElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as any).key).toBe(undefined);
    expect((container.childNodes[0] as HTMLDivElement).getAttribute('key')).toBe(null);
  });
});
