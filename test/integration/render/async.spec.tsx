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
      () => <Async render={() => new Promise(resolve => resolve(<div />))} pendingIndicator={<span />}/>,
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
      () => <Async render={() => Promise.resolve(<div />)} pendingIndicator={<span />}/>,
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
      () => <Async render={async () => <div />} pendingIndicator={<span />}/>,
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
      () => <local.Observer render={state => state === true && <Async render={() => Promise.resolve(<div />)} pendingIndicator={<span />}/>} />,
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
