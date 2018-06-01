import plusnew, { component, store, Animate } from 'index';

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
          () => ({}),
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
          () => ({}),
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
          () => ({}),
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
          () => ({}),
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
          () => ({ local }),
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  {local.state &&
                    <div />
                  }
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
          () => ({ local }),
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  {local.state &&
                    <div />
                  }
                  {local.state &&
                    <span />
                  }
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
          () => ({ local }),
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  {local.state &&
                    <div><div /></div>
                  }
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
          () => ({ local }),
          () => <Animate
                  elementWillUnmount={willUnmountSpy}
                >
                  {local.state &&
                    <div><div /></div>
                  }
                  {local.state &&
                    <span><span /></span>
                  }
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

      it('elementWillUnmount gets called with node', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolveParent = () => {};
        const unmountPromiseParent = new Promise((resolve) => {promiseResolveParent = resolve;});
        let promiseResolveChild = () => {};
        const unmountPromiseChild = new Promise((resolve) => {promiseResolveChild = resolve;});
        const willUnmountSpyParent = jasmine.createSpy('willUnmountParent', () => unmountPromiseParent).and.callThrough();
        const willUnmountSpyChild = jasmine.createSpy('willUnmount', () => unmountPromiseChild).and.callThrough();

        const Component = component(
          'Component',
          () => ({ local }),
          () =>
                <Animate
                  elementWillUnmount={willUnmountSpyParent}
                >
                  <Animate
                    elementWillUnmount={willUnmountSpyChild}
                  >
                    {local.state &&
                      <div><div /></div>
                    }
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
    });
  });
});
