import store from 'redchain';
import Plusnew from 'index';
import component from 'interfaces/component';

describe('rendering nested components', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;


  beforeEach(() => {
    plusnew = new Plusnew();

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('checks if nesting the components works', () => {
    type props = { value: string };
    const NestedComponent: component<props> = () => {
      return {
        render: (props: props) => <div className={props.value}>{props.value}</div>,
        dependencies: {},
      };
    };

    const local = new store((previousState: string | null, action: { type: string }) => {
      return action.type;
    }).dispatch({ type: 'foo' });

    const MainComponent: component<{}, { local: typeof local }> = () => {
      return {
        render: () => <NestedComponent value={local.state} />,
        dependencies: { local },
      };
    };

    plusnew.render(MainComponent, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');
    expect(textElement.textContent).toBe('foo');

    local.dispatch({ type: 'bar' });

    expect(target.className).toBe('bar');
    expect(target.innerHTML).toBe('bar');
    expect(textElement).toBe(textElement);
  });
});
