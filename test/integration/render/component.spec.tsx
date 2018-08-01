import plusnew, { Props, store, component } from 'index';
import ComponentInstance from 'instances/types/Component/Instance';
import FragmentInstance from 'instances/types/Fragment/Instance';
import types from 'instances/types/types';
import PlaceholderInstance from 'instances/types/Placeholder/Instance';

describe('rendering nested components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('checks if nesting the components works', () => {
    const NestedComponent = component(
      'Component',
      
    (Props: Props<{ value: string }>) => <Props render={props => <div className={props.value}>{props.value}</div>} />,
    );

    const local = store('foo', (state: string, newValue: string) => newValue);

    const MainComponent = component(
      'Component',
      () => <local.Observer render={local => <NestedComponent value={local} /> } />,
    );

    plusnew.render(<MainComponent />, container);

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

  it('saving new props of component', () => {
    const mainStore = store('foo-0', (store, action: string) => action);
    const nestedStore = store('bar-0', (store, action: string) => action);

    const NestedComponent = component(
      'Component',
      (Props: Props<{value: string}>) =>
        <>
          <Props render={props => <span>{props.value}</span> } />
          <nestedStore.Observer render={state => <span>{state}</span> } />
        </>,
    );
    const MainComponent = component(
      'Component',
      (Props: Props<{}>) =>
        <mainStore.Observer render={state =>
          <NestedComponent value={state} />
        } />,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo-0');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('bar-0');

    mainStore.dispatch('foo-1');
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo-1');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('bar-0');

    nestedStore.dispatch('bar-1');
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo-1');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('bar-1');
  });

  it('unregister dependencies', () => {
    const mainStore = store(true, (store, action: boolean) => action);
    const counterStore = store(0, (store, action: number) => action);

    const nestedUpdateSpy = jasmine.createSpy('nestedrender', (state: number) => state).and.callThrough();
    const containerUpdateSpy = jasmine.createSpy('render', (state: number) => state).and.callThrough();

    const NestedComponent = component(
      'Component',
      (Props: Props<{}>) =>
         <span><counterStore.Observer render={nestedUpdateSpy} /></span>,
    );

    const MainComponent = component(
      'Component',
      (Props: Props<{}>) =>
        <>
          <span><counterStore.Observer render={containerUpdateSpy} /></span>
          <mainStore.Observer render={state => state && <NestedComponent />} />
        </>,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
    const nestedNode = container.childNodes[1] as HTMLElement;
    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('0');
    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);

    mainStore.dispatch(false);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counterStore.dispatch(1);

    expect(containerUpdateSpy.calls.count()).toBe(2);
    expect(nestedUpdateSpy.calls.count()).toBe(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('');
  });

  it('unregister dependencies recusively when nested in dom element', () => {
    const mainStore = store(true, (store, action: boolean) => action);
    const counterStore = store(0, (store, action: number) => action);

    const nestedUpdateSpy = jasmine.createSpy('nestedrender', (state: number) => state).and.callThrough();
    const containerUpdateSpy = jasmine.createSpy('render', (state: number) => state).and.callThrough();

    const NestedComponent = component(
      'Component',
      (Props: Props<{}>) =>
         <span><counterStore.Observer render={nestedUpdateSpy} /></span>,
    );

    const MainComponent = component(
      'Component',
      (Props: Props<{}>) =>
        <>
          <span><counterStore.Observer render={containerUpdateSpy} /></span>
          <mainStore.Observer render={state => state &&
            <span>
              <NestedComponent />
            </span>
          } />
        </>,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
    const nestedNode = container.childNodes[1].childNodes[0] as HTMLElement;
    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('0');
    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);

    mainStore.dispatch(false);

    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counterStore.dispatch(1);

    expect(containerUpdateSpy.calls.count()).toBe(2);
    expect(nestedUpdateSpy.calls.count()).toBe(1);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('');
  });

  it('unregister dependencies recusively when nested in fragment element', () => {
    const mainStore = store(true, (store, action: boolean) => action);
    const counterStore = store(0, (store, action: number) => action);

    const nestedUpdateSpy = jasmine.createSpy('nestedrender', (state: number) => state).and.callThrough();
    const containerUpdateSpy = jasmine.createSpy('render', (state: number) => state).and.callThrough();

    const NestedComponent = component(
      'Component',
      (Props: Props<{}>) =>
         <span><counterStore.Observer render={nestedUpdateSpy} /></span>,
    );

    const MainComponent = component(
      'Component',
      (Props: Props<{}>) =>
        <>
          <span><counterStore.Observer render={containerUpdateSpy} /></span>
          <mainStore.Observer render={state => state &&
            <>
              <NestedComponent />
            </>
          } />
        </>,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
    const nestedNode = container.childNodes[1] as HTMLElement;
    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('0');
    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);

    mainStore.dispatch(false);

    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counterStore.dispatch(1);

    expect(containerUpdateSpy.calls.count()).toBe(2);
    expect(nestedUpdateSpy.calls.count()).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('');
  });

  it('unregister dependencies recusively when nested in array', () => {
    const mainStore = store(true, (store, action: boolean) => action);
    const counterStore = store(0, (store, action: number) => action);

    const nestedUpdateSpy = jasmine.createSpy('nestedrender', (state: number) => state).and.callThrough();
    const containerUpdateSpy = jasmine.createSpy('render', (state: number) => state).and.callThrough();

    const NestedComponent = component(
      'Component',
      (Props: Props<{}>) =>
         <span><counterStore.Observer render={nestedUpdateSpy} /></span>,
    );

    const MainComponent = component(
      'Component',
      (Props: Props<{}>) =>
        <>
          <span><counterStore.Observer render={containerUpdateSpy} /></span>
          <mainStore.Observer render={state => state &&
            [
              <NestedComponent key="0" />,
            ]
          } />
        </>,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
    const nestedNode = container.childNodes[1] as HTMLElement;
    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('0');
    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);

    mainStore.dispatch(false);

    expect(containerUpdateSpy.calls.count()).toBe(1);
    expect(nestedUpdateSpy.calls.count()).toBe(1);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    counterStore.dispatch(1);

    expect(containerUpdateSpy.calls.count()).toBe(2);
    expect(nestedUpdateSpy.calls.count()).toBe(1);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

    expect(nestedNode.tagName).toBe('SPAN');
    expect(nestedNode.innerHTML).toBe('');
  });

  it('nested component should not be created when shallow mode is active', () => {
    const NestedComponent = component(
      'Component',
      (Props: Props<{foo: number}>) => <div />,
    );

    const local = store(0, (_state, action: number) => action);

    const MainComponent = component(
      'Component',
      () =>
        <local.Observer render={state =>
          <>
            <NestedComponent foo={state }/>
            <span />
          </>
        } />,
    );

    const MainComponentElement = <MainComponent />;

    const mainComponent = plusnew.render(MainComponentElement, container, { createChildrenComponents: false }) as ComponentInstance<any>;

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    const nestedComponent = ((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered[0] as ComponentInstance<any>;
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);

    expect(nestedComponent.props.getState()).toEqual({ foo: 0, children: [] });

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.getState()).toEqual({ foo: 1, children: [] });
  });

  it('nested component should not be created when shallow mode is active', () => {
    const NestedComponent = component(
      'Component',
      (_Props: Props<{foo: number}>) => <div />,
    );

    const local = store(0, (_state, action: number) => action);

    const MainComponent = component(
      'Component',
      () =>
        <local.Observer render={state =>
            <>
              {state < 1 &&
                <NestedComponent foo={ state }/>
              }
              <span />
            </>
        } />,
    );

    const MainComponentElement = <MainComponent />;

    const mainComponent = plusnew.render(MainComponentElement, container, { createChildrenComponents: false }) as ComponentInstance<any>;

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    const nestedComponent = ((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered[0] as ComponentInstance<any>;
    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered.length).toBe(2);
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.getState()).toEqual({ foo: 0, children: [] });

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered.length).toBe(2);
    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered[0] instanceof PlaceholderInstance).toBe(true);
    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered[0]).not.toBe(nestedComponent);
  });

  it('nested component should not be created when shallow mode is active', () => {
    const NestedComponent = component(
      'Component',
      (Props: Props<{foo: number}>) => <div />,
    );

    const local = store(0, (_state, action: number) => action);

    const MainComponent = component(
      'Component',
      () =>
        <local.Observer render={state =>
          (state < 1 ? [
            <span key={1}/>,
            <NestedComponent key={0} foo={ state }/>,
          ] :  [
            <NestedComponent key={0} foo={ state }/>,
            <span key={1}/>,
          ])
        } />,
    );

    const MainComponentElement = <MainComponent />;

    const mainComponent = plusnew.render(MainComponentElement, container, { createChildrenComponents: false }) as ComponentInstance<any>;

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    const nestedComponent = ((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered[1] as ComponentInstance<any>;
    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered.length).toBe(2);
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.getState()).toEqual({ key: 0, foo: 0, children: [] });

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered[0] as ComponentInstance<any>).toBe(nestedComponent);
    expect(((mainComponent.rendered as ComponentInstance<any>).rendered as FragmentInstance).rendered.length).toBe(2);
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.getState()).toEqual({ key: 0, foo: 1, children: [] });
  });

  describe('nested render call', () => {
    it('nested component should not rerender without properties', () => {
      type props = {};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <NestedComponent />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);
    });

    it('nested component should not rerender with properties', () => {
      type props = {foo: {}};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const foo = {};

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <NestedComponent foo={foo}/>,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);
    });

    it('nested component should rerender on propertychange', () => {
      type props = {foo: {}};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};
      const bar = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent foo={foo}/>
            :
              <NestedComponent foo={bar}/>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender on more propertychange', () => {
      type props = {foo: {}, bar?: {}};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};
      const bar = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent foo={foo}/>
            :
              <NestedComponent foo={foo} bar={bar}/>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should not rerender with same children', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div foo={foo} /></NestedComponent>
            :
              <NestedComponent><div foo={foo} /></NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);
    });

    it('nested component should rerender with changed children', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};
      const bar = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div foo={foo} /></NestedComponent>
            :
              <NestedComponent><div foo={bar} /></NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different amount children', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div foo={foo} /><div foo={foo} /></NestedComponent>
            :
              <NestedComponent><div foo={foo} /></NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different amount children', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div foo={foo} /></NestedComponent>
            :
              <NestedComponent><div foo={foo} /><div foo={foo} /></NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different types of children', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = {};

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div foo={foo} /></NestedComponent>
            :
              <NestedComponent><span foo={foo} /></NestedComponent>
          } />,
        );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different types of multiple children', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      // There was a bug that the first child could be different, but the info isSame got overwritten by the last child-element
      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div foo="foo" /><span /></NestedComponent>
            :
              <NestedComponent><div foo="bar" /><span /></NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });



    it('nested component should not rerender with same content', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent>foo</NestedComponent>
            :
              <NestedComponent>foo</NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);
    });

    it('nested component should rerender with different content', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent>foo</NestedComponent>
            :
              <NestedComponent>bar</NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different content types', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent>{'1'}</NestedComponent>
            :
              <NestedComponent>{1}</NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with null types', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent>{null}</NestedComponent>
            :
              <NestedComponent>{null}</NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);
    });


    it('nested component should rerender with null types', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent><div /></NestedComponent>
            :
              <NestedComponent>{null}</NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with null types', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent>{null}</NestedComponent>
            :
              <NestedComponent><div /></NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender when an new array occured', () => {
      type props = { children: any};

      const renderSpy = jasmine.createSpy('render', (Props: Props<props>) => <Props render={nestedRenderSpy} />).and.callThrough();
      const nestedRenderSpy = jasmine.createSpy('nestedrender', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<props>) => plusnew.JSX.Element,
      );

      const foo = [<div />];

      const MainComponent = component(
        'Component',
        () =>
          <local.Observer render={state =>
            state === 0 ?
              <NestedComponent>{foo}</NestedComponent>
            :
              <NestedComponent>{foo}</NestedComponent>
          } />,
      );

      plusnew.render(<MainComponent />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(1);

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
      expect(nestedRenderSpy.calls.count()).toBe(2);
    });
  });


  it('removed nested component gets a componentWillUnmount call', () => {
    const componentWillUnmountSpy = jasmine.createSpy('componentWillUnmount', () => {});

    const local = store(true, (state, action: boolean) => action);

    const NestedComponent = component(
      'Component',
      () => <div />,
    );

    NestedComponent.prototype.componentWillUnmount = componentWillUnmountSpy;

    const MainComponent = component(
      'Component',
      () =>
        <local.Observer render={state =>
          state === true ?
            <NestedComponent />
          :
            null
        } />,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect(componentWillUnmountSpy.calls.count()).toBe(0);

    local.dispatch(false);

    expect(componentWillUnmountSpy.calls.count()).toBe(1);
    expect(componentWillUnmountSpy).toHaveBeenCalledWith({ children: [] });
  });


  it('removed nested component gets a componentWillUnmount call with props', () => {
    const componentWillUnmountSpy = jasmine.createSpy('componentWillUnmount', () => {});

    const local = store(true, (state, action: boolean) => action);

    const NestedComponent = component(
      'Component',
      (Props: Props<{ foo: string }>) => <div />,
    );

    NestedComponent.prototype.componentWillUnmount = componentWillUnmountSpy;

    const MainComponent = component(
      'Component',
     
      () =>
        <local.Observer render={state =>
          state === true ?
            <NestedComponent foo="bar" />
          :
            null
        } />,
    );

    plusnew.render(<MainComponent />, container);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect(componentWillUnmountSpy.calls.count()).toBe(0);

    local.dispatch(false);

    expect(componentWillUnmountSpy.calls.count()).toBe(1);
    expect(componentWillUnmountSpy).toHaveBeenCalledWith({ foo: 'bar', children: [] });
  });

  it('displayName is set', () => {
    const MainComponent = component(
      'Component',
      () => <div />,
    );

    expect(MainComponent.prototype.displayName).toBe('Component');
  });
});
