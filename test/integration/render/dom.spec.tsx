import plusnew, { component, store, InputEvent } from 'index';

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

  it('correct handling of viewBox', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <svg viewBox="0 0 100 100" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as SVGSVGElement;

    expect(target.getAttribute('viewBox')).toBe('0 0 100 100');
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

  it('input onchange', () => {
    const local = store('foo', (state, action: string) => action);

    const Component = component(
      () => ({ local }),
      () => <input value={local.state} onchange={(evt: InputEvent) => local.dispatch(evt.target.value)} />,
    );

    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLInputElement;
    expect(target.tagName).toBe('INPUT');
    expect(target.value).toBe('foo');

    const inputEvent = new Event('input');
    target.value = 'mep';

    target.dispatchEvent(inputEvent);

    expect(local.state).toBe('mep');

    target.value = 'anothermep';

    target.dispatchEvent(inputEvent);

    expect(local.state).toBe('anothermep');

    local.dispatch('completly other value');

    expect(target.value).toBe('completly other value');
  });

  it('input onchange', () => {
    const local = store('foo', (state, action: string) => action + 'suffix');

    const Component = component(
      () => ({ local }),
      () => <input value={local.state} onchange={(evt: InputEvent) => local.dispatch(evt.target.value)} />,
    );

    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLInputElement;
    expect(target.tagName).toBe('INPUT');
    expect(target.value).toBe('foo');

    const inputEvent = new Event('input');
    target.value = 'mep';
    target.dispatchEvent(inputEvent);

    expect(local.state).toBe('mepsuffix');
  });

  it('input onchange', () => {
    const local = store('foo', (state, action: string) => 'blarg');

    const Component = component(
      () => ({ local }),
      () => <input value={local.state} onchange={(evt: InputEvent) => local.dispatch(evt.target.value)} />,
    );

    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLInputElement;
    expect(target.tagName).toBe('INPUT');
    expect(target.value).toBe('foo');

    const inputEvent = new Event('input');
    target.value = 'mep';
    target.dispatchEvent(inputEvent);

    expect(local.state).toBe('blarg');

    target.value = 'meps';
    target.dispatchEvent(inputEvent);

    expect(local.state).toBe('blarg');
  });

  it('removing multiple children one at a time', () => {
    const local = store(0, (state, action: number) => action);

    const MainComponent = component(
      () => ({  local }),
      () => {
        if (local.state === 0) {
          return (
            <div>
              <span>foo1</span>
              <span>foo2</span>
              <span>foo3</span>
          </div>);
        }
        if (local.state === 1) {
          return (
            <div>
              <span>foo1</span>
              <span>foo2</span>
          </div>);
        }

        if (local.state === 2) {
          return (
            <div>
              <span>foo1</span>
          </div>);
        }

        return <div></div>;
      },
    );

    plusnew.render(<MainComponent />, container);

    const target = container.childNodes[0];

    expect(target.childNodes.length).toBe(3);
    expect((target.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('foo1');
    expect((target.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((target.childNodes[1] as HTMLElement).innerHTML).toBe('foo2');
    expect((target.childNodes[2] as HTMLElement).tagName).toBe('SPAN');
    expect((target.childNodes[2] as HTMLElement).innerHTML).toBe('foo3');

    local.dispatch(1);

    expect(target.childNodes.length).toBe(2);
    expect((target.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('foo1');
    expect((target.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((target.childNodes[1] as HTMLElement).innerHTML).toBe('foo2');

    local.dispatch(2);

    expect(target.childNodes.length).toBe(1);
    expect((target.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe('foo1');

    local.dispatch(3);

    expect(target.childNodes.length).toBe(0);
  });

  it('adding input without focus ', () => {
    const local = store(true, (state, action: boolean) => action);
    const MainComponent = component(
      () => ({  local }),
      () =>
        <input autofocus={false} />,
    );

    plusnew.render(<MainComponent />, container);

    expect(document.activeElement).not.toBe(container.childNodes[0] as Element);
  });

  it('adding input with focus ', () => {
    const local = store(true, (state, action: boolean) => action);
    const MainComponent = component(
      () => ({  local }),
      () =>
        <input value="djfngjnfdg" autofocus={true} />,
    );

    plusnew.render(<MainComponent />, container);

    expect(document.activeElement).toBe(container.childNodes[0] as Element);
  });
});
