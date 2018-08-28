import plusnew, { component, store, Portal } from 'index';

describe('<Portal />', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('portal should show outside of the tree', () => {
    const local = store(0, (store, action: number) => action);

    const outside = document.createElement('div');
    
    const Component = component(
      'Component',
     
      () => 
        <span>
          <local.Observer render={state =>
            state < 2 &&
              <Portal target={outside}>
                {state}
              </Portal>
          } />
          foo
        </span>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes[0].textContent).toBe('foo');

    expect(outside.childNodes.length).toBe(1);
    const outsideElement = outside.childNodes[0] as Text;
    expect(outsideElement.textContent).toBe('0');

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes[0].textContent).toBe('foo');

    expect(outside.childNodes.length).toBe(1);
    expect(outsideElement.textContent).toBe('1');

    local.dispatch(2);

    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes[0].textContent).toBe('foo');

    expect(outside.childNodes.length).toBe(0);
  });

  it('portal should have namespace of target-element', () => {
    const outside = document.createElement('div');

    const Component = component(
      'Component',
      () =>
        <svg>
            <Portal target={outside}>
              <span />
            </Portal>
          } />
        </svg>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).namespaceURI).toBe('http://www.w3.org/2000/svg');

    expect(outside.childNodes.length).toBe(1);
    expect((outside.childNodes[0] as HTMLElement).namespaceURI).toBe(outside.namespaceURI);

  });
});
