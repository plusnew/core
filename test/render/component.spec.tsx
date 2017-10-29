import redchain from 'redchain';
import Plusnew from 'index';
// import scheduler from 'scheduler';
import LifeCycleHandler from 'instances/types/Component/LifeCycleHandler';

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
    const NestedComponent = (lifeCycleHandler: LifeCycleHandler) => {
      return (props: {value: string}) => <div className={props.value}>{props.value}</div>;
    };

    const local = new redchain((previousState: string, newState: string) => {
      return newState;
    }).dispatch('foo');

    const MainComponent = (lifeCycleHandler: LifeCycleHandler) => {
      local.addOnChange(lifeCycleHandler.componentCheckUpdate);
      return (props: {value: string}) => <NestedComponent value={local.state} />;
    };

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
