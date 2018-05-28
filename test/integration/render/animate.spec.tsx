import plusnew, { component, store, Animate } from 'index';

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
        let promiseResolve: () => void;
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise);
        const Component = component(
          'Component',
          () => ({}),
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

        expect(willUnmountSpy.calls.count()).toBe(2);
        expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);
        expect(willUnmountSpy).toHaveBeenCalledWith(container.childNodes[0]);

        await new Promise(resolve => resolve());

        promiseResolve();

        expect(container.childNodes.length).toBe(0);
      });
  
      it('elementWillUnmount gets called with nodes', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve: () => void;
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise);
        const Component = component(
          'Component',
          () => ({}),
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

        await new Promise(resolve => resolve());

        promiseResolve();

        expect(container.childNodes.length).toBe(0);
      });
    });

    describe('nested', () => {
      it('elementWillUnmount gets called with node', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve: () => void;
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise);
        const Component = component(
          'Component',
          () => ({}),
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

        await new Promise(resolve => resolve());

        promiseResolve();

        expect(container.childNodes.length).toBe(0);
      });
  
      it('elementWillUnmount gets called with nodes', async () => {
        const local = store(true, (state, action: boolean) => action);
        let promiseResolve: () => void;
        const unmountPromise = new Promise((resolve) => {promiseResolve = resolve;});
        const willUnmountSpy = jasmine.createSpy('willUnmount', () => unmountPromise);
        const Component = component(
          'Component',
          () => ({}),
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

        await new Promise(resolve => resolve());

        promiseResolve();

        expect(container.childNodes.length).toBe(0);
      });
    });
  });
});
