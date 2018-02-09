import store from 'redchain';
import plusnew from 'index';
import factory from 'components/factory';

describe('rendering nested components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('checks if nesting the components works', () => {
    const NestedComponent = factory(
      () => ({}),
      (props: { value: string }) => <div className={props.value}>{props.value}</div>,
    );

    const local = store('foo', (state: string, newValue: string) => newValue);

    const MainComponent = factory(() => ({ local }), (props: {}) => <NestedComponent value={local.state} />);

    plusnew.render(MainComponent, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');
    expect(textElement.textContent).toBe('foo');

    local.dispatch('bar');

    expect(target.className).toBe('bar');
    expect(target.innerHTML).toBe('bar');
    expect(textElement).toBe(textElement);
  });
});
