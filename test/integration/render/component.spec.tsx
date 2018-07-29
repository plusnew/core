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

  // it('unregister dependencies', () => {
  //   const mainStore = store(true, (store, action: boolean) => action);
  //   const counterStore = store(0, (store, action: number) => action);

  //   const NestedComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //        <span>{counterStore.state}</span>,
  //   );

  //   const MainComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //       <>
  //         <span>{counterStore.state}</span>
  //         {mainStore.state && <NestedComponent />}
  //       </>,
  //   );

  //   const updateSpy = spyOn(ComponentInstance.prototype, 'update' as any).and.callThrough();
  //   plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(2);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
  //   const nestedNode = container.childNodes[1] as HTMLElement;
  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('0');

  //   mainStore.dispatch(false);

  //   expect(updateSpy.calls.count()).toBe(1);

  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

  //   counterStore.dispatch(1);

  //   expect(updateSpy.calls.count()).toBe(2);

  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('');
  // });

  // it('unregister dependencies recusively when nested in dom element', () => {
  //   const mainStore = store(true, (store, action: boolean) => action);
  //   const counterStore = store(0, (store, action: number) => action);

  //   const NestedComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //        <span>{counterStore.state}</span>,
  //   );

  //   const MainComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //       <>
  //         <span>{counterStore.state}</span>
  //         {mainStore.state &&
  //           <span>
  //             <NestedComponent />
  //           </span>
  //         }
  //       </>,
  //   );

  //   const updateSpy = spyOn(ComponentInstance.prototype, 'update' as any).and.callThrough();
  //   plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(2);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
  //   const nestedNode = container.childNodes[1].childNodes[0] as HTMLElement;
  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('0');

  //   mainStore.dispatch(false);

  //   expect(updateSpy.calls.count()).toBe(1);
  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

  //   counterStore.dispatch(1);

  //   expect(updateSpy.calls.count()).toBe(2);
  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('');
  // });

  // it('unregister dependencies recusively when nested in fragment element', () => {
  //   const mainStore = store(true, (store, action: boolean) => action);
  //   const counterStore = store(0, (store, action: number) => action);

  //   const NestedComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //        <span>{counterStore.state}</span>,
  //   );

  //   const MainComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //       <>
  //         <span>{counterStore.state}</span>
  //         {mainStore.state &&
  //           <>
  //             <NestedComponent />
  //           </>
  //         }
  //       </>,
  //   );

  //   const updateSpy = spyOn(ComponentInstance.prototype, 'update' as any).and.callThrough();
  //   plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(2);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
  //   const nestedNode = container.childNodes[1] as HTMLElement;
  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('0');

  //   mainStore.dispatch(false);

  //   expect(updateSpy.calls.count()).toBe(1);
  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

  //   counterStore.dispatch(1);

  //   expect(updateSpy.calls.count()).toBe(2);
  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('');
  // });

  // it('unregister dependencies recusively when nested in array', () => {
  //   const mainStore = store(true, (store, action: boolean) => action);
  //   const counterStore = store(0, (store, action: number) => action);

  //   const NestedComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //        <span>{counterStore.state}</span>,
  //   );

  //   const MainComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>) =>
  //       <>
  //         <span>{counterStore.state}</span>
  //         {mainStore.state &&
  //           [
  //             <NestedComponent key="0" />,
  //           ]
  //         }
  //       </>,
  //   );

  //   const updateSpy = spyOn(ComponentInstance.prototype, 'update' as any).and.callThrough();
  //   plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(2);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
  //   const nestedNode = container.childNodes[1] as HTMLElement;
  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('0');

  //   mainStore.dispatch(false);

  //   expect(updateSpy.calls.count()).toBe(1);
  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

  //   counterStore.dispatch(1);

  //   expect(updateSpy.calls.count()).toBe(2);
  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  //   expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

  //   expect(nestedNode.tagName).toBe('SPAN');
  //   expect(nestedNode.innerHTML).toBe('');
  // });

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

    const nestedComponent = (mainComponent.rendered as FragmentInstance).rendered[0] as ComponentInstance<any>;
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.state).toEqual({ foo: 0, children: [] });

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.state).toEqual({ foo: 1, children: [] });
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

    const nestedComponent = (mainComponent.rendered as FragmentInstance).rendered[0] as ComponentInstance<any>;
    expect((mainComponent.rendered as FragmentInstance).rendered.length).toBe(2);
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.state).toEqual({ foo: 0, children: [] });

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    expect((mainComponent.rendered as FragmentInstance).rendered.length).toBe(2);
    expect((mainComponent.rendered as FragmentInstance).rendered[0] instanceof PlaceholderInstance).toBe(true);
    expect((mainComponent.rendered as FragmentInstance).rendered[0]).not.toBe(nestedComponent);
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

    const nestedComponent = (mainComponent.rendered as FragmentInstance).rendered[1] as ComponentInstance<any>;
    expect((mainComponent.rendered as FragmentInstance).rendered.length).toBe(2);
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.state).toEqual({ key: 0, foo: 0, children: [] });

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    expect((mainComponent.rendered as FragmentInstance).rendered[0] as ComponentInstance<any>).toBe(nestedComponent);
    expect((mainComponent.rendered as FragmentInstance).rendered.length).toBe(2);
    expect(nestedComponent.nodeType).toBe(types.Component);
    expect(nestedComponent.type as any).toBe(NestedComponent);
    expect(nestedComponent.props.state).toEqual({ key: 0, foo: 1, children: [] });
  });

  describe('nested render call', () => {
    it('nested component should not rerender without properties', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
    });

    it('nested component should not rerender with properties', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const foo = {};

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{foo: {}}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
    });

    it('nested component should rerender on propertychange', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{foo: {}}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender on more propertychange', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{foo: {}, bar?: {}}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should not rerender with same children', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
    });

    it('nested component should rerender with changed children', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different amount children', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different amount children', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different types of children', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different types of multiple children', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });



    it('nested component should not rerender with same content', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
    });

    it('nested component should rerender with different content', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with different content types', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with null types', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(1);
    });


    it('nested component should rerender with null types', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender with null types', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });

    it('nested component should rerender when an new array occured', () => {
      const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

      const local = store(0, (state, action: number) => state + action);

      const NestedComponent = component(
        'Component',
        renderSpy as (Props: Props<{children: any}>) => plusnew.JSX.Element,
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

      local.dispatch(1);

      expect(renderSpy.calls.count()).toBe(2);
    });
  });


  // it('removed nested component gets a componentWillUnmount call', () => {
  //   const componentWillUnmountSpy = jasmine.createSpy('componentWillUnmount', () => {});

  //   const local = store(true, (state, action: boolean) => action);

  //   const dependencies = {
  //     someStore: store(true, (state, action: boolean) => action),
  //   };

  //   const NestedComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>, config: componentOptions<{}, {}>) => {
  //       config.componentWillUnmount = componentWillUnmountSpy;
  //       return dependencies;
  //     },
  //     () => <div />,
  //   );


  //   const MainComponent = component(
  //     'Component',
     
  //     () =>
  //       local.state === true ?
  //         <NestedComponent />
  //       :
  //         null,
  //   );

  //   plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  //   expect(componentWillUnmountSpy.calls.count()).toBe(0);

  //   local.dispatch(false);

  //   expect(componentWillUnmountSpy.calls.count()).toBe(1);
  //   expect(componentWillUnmountSpy).toHaveBeenCalledWith({ children: [] }, dependencies);
  // });


  // it('removed nested component gets a componentWillUnmount call with dependencies', () => {
  //   const componentWillUnmountSpy = jasmine.createSpy('componentWillUnmount', () => {});

  //   const local = store(true, (state, action: boolean) => action);

  //   const dependencies = {
  //     someStore: store(true, (state, action: boolean) => action),
  //   };

  //   type props = { foo: string };
  //   const NestedComponent = component(
  //     'Component',
  //     (props: props, options: componentOptions<props, {}>) => {
  //       options.componentWillUnmount = componentWillUnmountSpy;
  //       return dependencies;
  //     },
  //     (props: props) => <div />,
  //   );

  //   const MainComponent = component(
  //     'Component',
     
  //     () =>
  //       local.state === true ?
  //         <NestedComponent foo="bar" />
  //       :
  //         null,
  //   );

  //   plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
  //   expect(componentWillUnmountSpy.calls.count()).toBe(0);

  //   local.dispatch(false);

  //   expect(componentWillUnmountSpy.calls.count()).toBe(1);
  //   expect(componentWillUnmountSpy).toHaveBeenCalledWith({ foo: 'bar', children: [] }, dependencies);
  // });

  // it('config object is shared by constructor and render function', () => {

  //   const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

  //   const MainComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>, options: componentOptions<any, any>) => {
  //       options.foo = 'bar';
  //       return {};
  //     },
  //     renderSpy,
  //   );

  //   const instance = plusnew.render(<MainComponent />, container);

  //   expect(container.childNodes.length).toBe(1);
  //   expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');

  //   expect(renderSpy).toHaveBeenCalledWith({ children: [] }, {}, { instance, foo: 'bar' });
  // });

  // it('displayName is set', () => {

  //   const renderSpy = jasmine.createSpy('render', () => <div />).and.callThrough();

  //   const MainComponent = component(
  //     'Component',
  //     (Props: Consumer<{}>, options: componentOptions<any, any>) => {
  //       options.foo = 'bar';
  //       return {};
  //     },
  //     renderSpy,
  //   );

  //   expect(MainComponent.prototype.displayName).toBe('Component');
  // });
});
