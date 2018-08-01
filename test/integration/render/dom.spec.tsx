import plusnew, { component, store, KeyboardEvent } from 'index';

describe('dom handling', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('correct handling of acceptCharset', () => {
    const Component = component(
      'Component',
      () =>
        <form acceptCharset="UTF-8" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLFormElement;

    expect(target.acceptCharset).toBe('UTF-8');
  });

  it('correct handling of class', () => {
    const Component = component(
      'Component',
      () =>
        <div className="foo" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLElement;

    expect(target.className).toBe('foo');
  });

  it('correct handling of htmlFor', () => {
    const Component = component(
      'Component',
      () =>
        <label htmlFor="foo" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLLabelElement;

    expect(target.htmlFor).toBe('foo');
  });

  it('correct handling of httpEquiv', () => {
    const Component = component(
      'Component',
      () =>
        <meta httpEquiv="refresh" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLMetaElement;

    expect(target.httpEquiv).toBe('refresh');
  });

  it('correct handling of onclick', () => {
    const clickHandler = () => {};

    const Component = component(
      'Component',
      () =>
        <span onclick={clickHandler} />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLMetaElement;

    expect(target.onclick).toBe(clickHandler);
  });

  it('correct handling of viewBox', () => {
    const Component = component(
      'Component',
      () =>
        <svg viewBox="0 0 100 100" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as SVGSVGElement;

    expect(target.getAttribute('viewBox')).toBe('0 0 100 100');
  });

  it('replacing children of dom', () => {
    const local = store(true, (state, action: boolean) => action);
    const MainComponent = component(
      'Component',
      () =>
        <local.Observer render={state =>
          state ?
            <div>
              <span>foo</span>
            </div>
          :
            <div>
              <span>bar</span>
              <span>baz</span>
            </div>
        } />,
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
      'Component',
      () =>
        <local.Observer render={state =>
          <input disabled={state} />
        } />,
    );

    plusnew.render(<Component />, container);

    expect((container.childNodes[0] as HTMLInputElement).tagName).toBe('INPUT');
    expect((container.childNodes[0] as HTMLInputElement).disabled).toBe(local.getState());

    local.dispatch(false);

    expect((container.childNodes[0] as HTMLInputElement).disabled).toBe(local.getState());

    local.dispatch(true);

    expect((container.childNodes[0] as HTMLInputElement).disabled).toBe(local.getState());
  });

  it('plusnew attributes', () => {
    const Component = component(
      'Component',
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
      'Component',
      () => 
      <local.Observer render={state =>
        <input value={state} onchange={(evt: KeyboardEvent<HTMLInputElement>) => local.dispatch(evt.target.value)} />
      } />,
    );

    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLInputElement;
    expect(target.tagName).toBe('INPUT');
    expect(target.value).toBe('foo');

    const inputEvent = new Event('input');
    target.value = 'mep';

    target.dispatchEvent(inputEvent);

    expect(local.getState()).toBe('mep');

    target.value = 'anothermep';

    target.dispatchEvent(inputEvent);

    expect(local.getState()).toBe('anothermep');

    local.dispatch('completly other value');

    expect(target.value).toBe('completly other value');
  });

  it('input onchange', () => {
    const local = store('foo', (state, action: string) => action + 'suffix');

    const Component = component(
      'Component',
      () =>
        <local.Observer render={state =>
          <input value={state} onchange={(evt: KeyboardEvent<HTMLInputElement>) => local.dispatch(evt.target.value)} />
        } />,
    );

    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLInputElement;
    expect(target.tagName).toBe('INPUT');
    expect(target.value).toBe('foo');

    const inputEvent = new Event('input');
    target.value = 'mep';
    target.dispatchEvent(inputEvent);

    expect(local.getState()).toBe('mepsuffix');
  });

  it('input onchange', () => {
    const local = store('foo', (state, action: string) => 'blarg');

    const Component = component(
      'Component',
      () =>
        <local.Observer render={state =>
          <input value={state} onchange={(evt: KeyboardEvent<HTMLInputElement>) => local.dispatch(evt.target.value)} />
        } />,
    );

    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLInputElement;
    expect(target.tagName).toBe('INPUT');
    expect(target.value).toBe('foo');

    const inputEvent = new Event('input');
    target.value = 'mep';
    target.dispatchEvent(inputEvent);

    expect(local.getState()).toBe('blarg');

    target.value = 'meps';
    target.dispatchEvent(inputEvent);

    expect(local.getState()).toBe('blarg');
  });

  it('removing multiple children one at a time', () => {
    const local = store(0, (state, action: number) => action);

    const MainComponent = component(
      'Component',
      () => 
        <local.Observer render={(state) => {
          if (state === 0) {
            return (
              <div>
                <span>foo1</span>
                <span>foo2</span>
                <span>foo3</span>
            </div>);
          }
          if (state === 1) {
            return (
              <div>
                <span>foo1</span>
                <span>foo2</span>
            </div>);
          }

          if (state === 2) {
            return (
              <div>
                <span>foo1</span>
            </div>);
          }

          return <div></div>;
        }} />,
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
    const MainComponent = component(
      'Component',
      () =>
        <input autofocus={false} />,
    );

    plusnew.render(<MainComponent />, container);

    expect(document.activeElement).not.toBe(container.childNodes[0] as Element);
  });

  it('adding input with focus ', () => {
    const MainComponent = component(
      'Component',
      () =>
        <input value="djfngjnfdg" autofocus={true} />,
    );

    plusnew.render(<MainComponent />, container);

    expect(document.activeElement).toBe(container.childNodes[0] as Element);
  });

  it('adding nested input with focus ', () => {
    const MainComponent = component(
      'Component',
      () =>
        <div><input value="djfngjnfdg" autofocus={true} /></div>,
    );

    plusnew.render(<MainComponent />, container);

    expect(document.activeElement).toBe(container.childNodes[0].childNodes[0] as Element);
  });
});
