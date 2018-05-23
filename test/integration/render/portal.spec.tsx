import plusnew, { component, store, Portal } from 'index';

describe('firing input events', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('portal should show otuside of the tree', () => {
    const local = store(0, (store, action: number) => action);

    const outside = document.createElement('div');
    
    const Component = component(
      'Component',
      () => ({ local }),
      (props: {}, { local }) => 
        <span>
          {local.state < 2 &&
            <Portal target={outside}>
              {local.state}
            </Portal>
          }
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
});
