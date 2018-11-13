import plusnew, { component, Async, store } from 'index';

async function tick(count: number) {
  for (let i = 0; i < count; i += 1) {
    await new Promise(resolve => resolve());
  }
}

describe('<Animate />', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('show loading when promise is not resolved yet and then show resolved promise', async () => {
    const Component = component(
      'Component',
      () => <Async pendingIndicator={<span />}>{() => new Promise(resolve => resolve(<div />))}</Async>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('show resolved promise', async () => {
    const Component = component(
      'Component',
      () => <Async pendingIndicator={<span />}>{() => Promise.resolve(<div />)}</Async>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('change promise with props', async () => {
    const local = store(0, (_state, action: number) => action);
    const Component = component(
      'Component',
      () => <local.Observer>{state => <Async pendingIndicator={<span />}>{() => Promise.resolve(<div>{state}</div>)}</Async>}</local.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick(1);

    const element = container.childNodes[0] as HTMLElement;
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    local.dispatch(1);

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');
    expect((container.childNodes[0] as HTMLElement)).toBe(element);
  });

  it('discard promise resolve, when a new one was given', async () => {
    const local = store(0, (_state, action: number) => action);

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <Async pendingIndicator={<span />}>{async () => {
            if (state === 0) {
              await tick(2);
              return <div>old</div>;
            }
            return <div>new</div>;
          }}</Async>
        }</local.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    local.dispatch(1);

    await tick(1);

    const element = container.childNodes[0] as HTMLElement;
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('new');

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('new');
    expect((container.childNodes[0] as HTMLElement)).toBe(element);
  });

  it('show pending indicator', async () => {
    const local = store(0, (_state, action: number) => action);

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <Async pendingIndicator={<span />}>{async () => {
            if (state === 1) {
              await tick(1);
              return <div>new</div>;
            }
            return <div>old</div>;
          }}</Async>
        }</local.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('old');

    local.dispatch(1);
    await tick(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('new');
  });

  it('show resolved promise', async () => {
    const Component = component(
      'Component',
      () => <Async pendingIndicator={<span />}>{async () => <div />}</Async>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  });

  it('remove async component', async () => {
    const local = store(true, (_state, action: boolean) => action);

    const Component = component(
      'Component',
      () =>
        <local.Observer>
          {state => state === true && <Async pendingIndicator={<span />}>{() => Promise.resolve(<div />)}</Async>}
        </local.Observer>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    local.dispatch(false);
    expect(container.childNodes.length).toBe(0);

    await tick(1);

    expect(container.childNodes.length).toBe(0);
  });
});
