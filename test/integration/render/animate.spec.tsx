import plusnew, { Consumer, component, store, Animate } from 'index';

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

  describe('elementDidMount', () => {
    describe('flat', () => {
      it('elementDidMount gets called with node', () => {
        const didMountSpy = jasmine.createSpy('didMount', () => null);
        const Component = component(
          'Component',
          () => <Animate
                  elementDidMount={didMountSpy}
                >
                  <div />
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(didMountSpy.calls.count()).toBe(1);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0]);
      });
  
      it('elementDidMount gets called with nodes', () => {
        const didMountSpy = jasmine.createSpy('didMount', () => null);
        const Component = component(
          'Component',
          () => <Animate
                  elementDidMount={didMountSpy}
                >
                  <div />
                  <span />
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
        expect(didMountSpy.calls.count()).toBe(2);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[1]);
      });
    });

    describe('nested', () => {
      it('elementDidMount gets called with node', () => {
        const didMountSpy = jasmine.createSpy('didMount', () => null);
        const Component = component(
          'Component',
          () => <Animate
                  elementDidMount={didMountSpy}
                >
                  <div><div /></div>
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(didMountSpy.calls.count()).toBe(1);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0]);
      });
  
      it('elementDidMount gets called with nodes', () => {
        const didMountSpy = jasmine.createSpy('didMount', () => null);
        const Component = component(
          'Component',
          () => <Animate
                  elementDidMount={didMountSpy}
                >
                  <div><div /></div>
                  <span><span /></span>
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
        expect(didMountSpy.calls.count()).toBe(2);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[1]);
      });
    });
  });

  describe('elementWillUnmount', () => {
    describe('flat', () => {
      it('elementWillUnmount gets called with node', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Consumer render={state =>
                    state && <div />
                  } />
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });
  
      it('elementWillUnmount gets called with nodes', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Consumer render={state =>
                    state && <div />
                  } />
                  <local.Consumer render={state =>
                    state && <span />
                  } />
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[1]);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });
    });

    describe('nested', () => {
      it('elementWillUnmount gets called with node', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Consumer render={state =>
                    local && <div><div /></div>
                  } />
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });
  
      it('elementWillUnmount gets called with nodes', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Consumer render={state =>
                    state && <div><div /></div>
                  } />

                  <local.Consumer render={state =>
                    state && <span><span /></span>
                  } />
                </Animate>,
        );
  
        plusnew.render(<Component />, container);
  
        expect(container.childNodes.length).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[1]);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmounts gets called with node after the parent gets resolved', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveParent = () => {};
        const unmountPromiseParent = new Promise((resolve) => {promiseResolveParent = resolve;});
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => {promiseResolveChild = resolve;});
        const willUnmountSpyParent = jasmine.createSpy('willUnmountParent', () => unmountPromiseParent).and.callThrough();
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', () => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () =>
                <Animate
                  elementWillUnmount={willUnmountSpyParent}
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    <local.Consumer render={state =>
                      state && <div><div /></div>
                    } />
                  </Animate>
                </Animate>,
        );

        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyParent.calls.count()).toBe(0);
        expect(willUnmountSpyChild.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpyParent.calls.count()).toBe(1);
        expect(willUnmountSpyChild.calls.count()).toBe(0);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyParent).toHaveBeenCalledWith(container.childNodes[0]);

        await tick(1);
        promiseResolveParent();
        await tick(1);

        expect(willUnmountSpyParent.calls.count()).toBe(1);
        expect(willUnmountSpyChild.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyChild).toHaveBeenCalledWith(container.childNodes[0]);

        await tick(1);
        promiseResolveChild();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmounts gets called synchronosly', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => {promiseResolveChild = resolve;});
        const willUnmountSpyParent = jasmine.createSpy('willUnmountParent', () => {}).and.callThrough();
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', () => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () =>
                <Animate
                  elementWillUnmount={willUnmountSpyParent}
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    <local.Consumer render={state =>
                      <div><div /></div>
                    } />
                  </Animate>
                </Animate>,
        );

        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyParent.calls.count()).toBe(0);
        expect(willUnmountSpyChild.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpyParent.calls.count()).toBe(1);
        expect(willUnmountSpyChild.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyParent).toHaveBeenCalledWith(container.childNodes[0]);

        await tick(1);
        promiseResolveChild();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });


      it('elementWillUnmounts gets called even with nested Animate', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => {promiseResolveChild = resolve;});
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', () => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () =>
                <Animate
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    <local.Consumer render={state =>
                      state && <div><div /></div>
                    } />
                  </Animate>
                </Animate>,
        );

        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyChild.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpyChild.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');

        await tick(1);
        promiseResolveChild();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmount gets called with node, when parent-fragment gets removed', async () => {
        const local = store(true, (_state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () =>
            <>
              <local.Consumer render={state =>
                state &&
                  <>
                    <Animate
                      elementWillUnmount={willUnmountSpy}
                    >
                      <div />
                    </Animate>
                  </>
              } />
            </>,
        );
  
        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });
    });

    it('elementWillUnmount gets called with node, when parent-component gets removed', async () => {
      const local = store(true, (state, action: boolean) => action);
      let promiseResolve = () => {};
      const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
      const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise).and.callThrough();
      const ProxyComponent = component(
        'ProxyComponent',
        (Props: Consumer<{ children: any}>) => <Props render={props => props.children} />,
      );
      
      const Component = component(
        'Component',

        () =>
          <>
            <local.Consumer render={state =>
              state &&
                <ProxyComponent>
                  <Animate
                    elementWillUnmount={willUnmountSpy}
                  >
                    <div />
                  </Animate>
                </ProxyComponent>
            } />
          </>,
      );

      plusnew.render(<Component />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(willUnmountSpy.calls.count()).toBe(0);

      local.dispatch(false);

      expect(willUnmountSpy.calls.count()).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);
      expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);

      await tick(1);
      promiseResolve();
      await tick(1);

      expect(container.childNodes.length).toBe(0);
    });


    it('elementWillUnmount gets not called with node, when parent-dom gets removed', async () => {
      const local = store(true, (state, action: boolean) => action);
      const willUnmountSpy = jasmine.createSpy('willUnmount', () => {}).and.callThrough();
      
      const Component = component(
        'Component',
        () =>
          <>
            <local.Consumer render={state =>
              state &&
                <span>
                  <Animate
                    elementWillUnmount={willUnmountSpy}
                  >
                    <div />
                  </Animate>
                </span>
            } />
          </>,
      );

      plusnew.render(<Component />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
      expect((container.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(willUnmountSpy.calls.count()).toBe(0);

      local.dispatch(false);

      expect(willUnmountSpy.calls.count()).toBe(0);
      expect(container.childNodes.length).toBe(0);
    });

    it('removal works, without error', async () => {
      const local = store(true, (_state, action: boolean) => action);
      const Component = component(
        'Component',
        () => <Animate elementWillUnmount={() => Promise.resolve()}>
                <Animate>
                  <local.Consumer render={state =>
                    state && <div />
                  } />
                </Animate>
              </Animate>,
      );

      plusnew.render(<Component />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');

      local.dispatch(false);

      await tick(1);

      expect(container.childNodes.length).toBe(0);
    });
  });
});
