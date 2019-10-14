import plusnew, { Props, component, store, Animate } from 'index';

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
        const didMountSpy = jasmine.createSpy('didMount', (_element: Element) => null);
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
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
      });

      it('elementDidMount gets called with nodes', () => {
        const didMountSpy = jasmine.createSpy('didMount', (_element: Element) => null);
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
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[1] as Element);
      });
    });

    describe('nested', () => {
      it('elementDidMount gets called with node', () => {
        const didMountSpy = jasmine.createSpy('didMount', (_element: Element) => null);
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
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
      });

      it('elementDidMount gets called with nodes', () => {
        const didMountSpy = jasmine.createSpy('didMount', (_element: Element) => null);
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
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
        expect(didMountSpy).toHaveBeenCalledWith(container.childNodes[1] as Element);
      });
    });
  });

  describe('elementWillUnmount', () => {
    describe('flat', () => {
      it('elementWillUnmount gets called with node', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => { promiseResolve = resolve; });
        const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Observer>
                    {state =>
                      state && <div />
                    }
                  </local.Observer>
                </Animate>,
        );

        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmount gets called with nodes', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => { promiseResolve = resolve; });
        const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Observer>
                    {state => state && <div />
                    }
                  </local.Observer>
                  <local.Observer>
                    {state => state && <span />
                    }
                  </local.Observer>
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
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[1] as Element);

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
        const unmountPromise = new Promise((resolve) => { promiseResolve = resolve; });
        const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Observer>
                    {state => state && <div><div /></div>}
                  </local.Observer>
                </Animate>,
        );

        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmount gets called with nodes', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve = () => {};
        const unmountPromise = new Promise((resolve) => { promiseResolve = resolve; });
        const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  <local.Observer>
                    {state =>
                      state && <div><div /></div>
                    }
                  </local.Observer>

                  <local.Observer>
                    {state => state && <span><span /></span>}
                  </local.Observer>
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
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[1] as Element);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmounts gets called with node after the parent gets resolved', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveParent = () => {};
        const unmountPromiseParent = new Promise((resolve) => { promiseResolveParent = resolve; });
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => { promiseResolveChild = resolve; });
        const willUnmountSpyParent = jasmine.createSpy('willUnmountParent', (_element: Element) => unmountPromiseParent).and.callThrough();
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () =>
                <Animate
                  elementWillUnmount={willUnmountSpyParent}
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    <local.Observer>
                      {state => state && <div><div /></div>}
                    </local.Observer>
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
        expect(willUnmountSpyParent).toHaveBeenCalledWith(container.childNodes[0] as Element);

        await tick(1);
        promiseResolveParent();
        await tick(1);

        expect(willUnmountSpyParent.calls.count()).toBe(1);
        expect(willUnmountSpyChild.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpyChild).toHaveBeenCalledWith(container.childNodes[0] as Element);

        await tick(1);
        promiseResolveChild();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmounts gets called synchronosly', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => { promiseResolveChild = resolve; });
        const willUnmountSpyParent = jasmine.createSpy('willUnmountParent', (_element: Element) => {}).and.callThrough();
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () =>
                <Animate
                  elementWillUnmount={willUnmountSpyParent}
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    <local.Observer>
                      {state => state && <div><div /></div>}
                    </local.Observer>
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
        expect(willUnmountSpyParent).toHaveBeenCalledWith(container.childNodes[0] as Element);

        await tick(1);
        promiseResolveChild();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });

      it('elementWillUnmounts gets called even with nested Animate', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => { promiseResolveChild = resolve; });
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () =>
                <Animate
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    <local.Observer>
                      {state => state && <div><div /></div>}
                    </local.Observer>
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
        const unmountPromise = new Promise((resolve) => { promiseResolve = resolve; });
        const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromise).and.callThrough();
        const Component = component(
          'Component',
          () =>
            <>
              <local.Observer>
                {state =>
                  state &&
                    <>
                      <Animate
                        elementWillUnmount={willUnmountSpy}
                      >
                        <div />
                      </Animate>
                    </>
                }
              </local.Observer>
            </>,
        );

        plusnew.render(<Component />, container);

        expect(container.childNodes.length).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy.calls.count()).toBe(0);

        local.dispatch(false);

        expect(willUnmountSpy.calls.count()).toBe(1);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);

        await tick(1);
        promiseResolve();
        await tick(1);

        expect(container.childNodes.length).toBe(0);
      });
    });

    it('elementWillUnmount gets called with node, when parent-component gets removed', async () => {
      const local = store(true, (state, action: boolean) => action);
      let promiseResolve = () => {};
      const unmountPromise = new Promise((resolve) => { promiseResolve = resolve; });
      const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => unmountPromise).and.callThrough();
      const ProxyComponent = component(
        'ProxyComponent',
        (Props: Props<{ children: any}>) => <Props>{props => props.children}</Props>,
      );

      const Component = component(
        'Component',
        () =>
          <>
            <local.Observer>
              {state =>
                state &&
                  <ProxyComponent>
                    <Animate
                      elementWillUnmount={willUnmountSpy}
                    >
                      <div />
                    </Animate>
                  </ProxyComponent>
              }
            </local.Observer>
          </>,
      );

      plusnew.render(<Component />, container);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(willUnmountSpy.calls.count()).toBe(0);

      local.dispatch(false);

      expect(willUnmountSpy.calls.count()).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
      expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);
      expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0] as Element);

      await tick(1);
      promiseResolve();
      await tick(1);

      expect(container.childNodes.length).toBe(0);
    });

    it('elementWillUnmount gets not called with node, when parent-dom gets removed', async () => {
      const local = store(true, (_state, action: boolean) => action);
      const willUnmountSpy = jasmine.createSpy('willUnmount', (_element: Element) => {}).and.callThrough();

      const Component = component(
        'Component',
        () =>
          <>
            <local.Observer>
              {state =>
                state &&
                  <span>
                    <Animate
                      elementWillUnmount={willUnmountSpy}
                    >
                      <div />
                    </Animate>
                  </span>
              }
            </local.Observer>
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
                  <local.Observer>
                    {state =>
                      state && <div />
                    }
                  </local.Observer>
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
