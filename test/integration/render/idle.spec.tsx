import plusnew, { component, store, Idle, storeType } from 'index';

describe('<Idle />', () => {
  let container: HTMLElement;
  let urgentStore: storeType<boolean, boolean>;

  beforeEach(() => {
    urgentStore = store(false, (_state, action: boolean) => action);
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  describe('with idle callback existing in the browser', () => {
    let requestIdleCallbackSpy: jasmine.Spy;
    let cancelIdleCallbackSpy: jasmine.Spy;

    beforeEach(() => {
      requestIdleCallbackSpy = spyOn(window, 'requestIdleCallback' as any).and.returnValue('foo');
      cancelIdleCallbackSpy = spyOn(window, 'cancelIdleCallback' as any).and.returnValue('foo');
    });

    it('idleCallback is not called when <Idle urgent={true} />', () => {

    });

    it('idleCallback is called and canceled when it went to <Idle urgent={true} />', () => {

    });

    it('idleCallback is called and executed, does not get canceled when urgent switches to true', () => {

    });
  });

  describe('without idle callback existing in the browser', () => {
    it('content should be executed immidiatley', () => {

    });
  });
});
