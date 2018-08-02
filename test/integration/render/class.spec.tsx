import plusnew, { Props, Component,  store } from 'index';

describe('rendering class components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('class component gets rendered', () => {
    class MainComponent extends Component<any>{
      render() {
        return <div />;
      }
    }

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLDivElement).tagName).toBe('DIV');
  });

  it('class component gets rerendered', () => {
    const local = store(0, (_state, action: number) => action);

    class MainComponent extends Component<{}> {
      dependencies = {
        local,
      };

      render() {
        return <div><local.Observer render={local => local} /></div>;
      }
    }

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLDivElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLDivElement).innerHTML).toBe('0');

    local.dispatch(1);

    expect((container.childNodes[0] as HTMLDivElement).innerHTML).toBe('1');
  });

  it('class component gets props', () => {
    const local = store(0, (_state, action: number) => action);

    class MainComponent extends Component<{}> {
      render() {
        return <local.Observer render={local => <NestedComponent foo={local}/> } />;
      }
    }

    type props = {foo: number};

    class NestedComponent extends Component<props> {
      render(Props: Props<props>) {
        return <div><Props render={local => local.foo} /></div>;
      }
    }

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLDivElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLDivElement).innerHTML).toBe('0');

    local.dispatch(1);

    expect((container.childNodes[0] as HTMLDivElement).innerHTML).toBe('1');
  });
});
