import redchain from 'util/store';

describe('reducer', () => {
  it('is the reducer correctly called', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => {
      return originalState + action;
    }).and.callThrough();

    const store = redchain(1, reducerSpy);

    expect(reducerSpy.calls.count()).toBe(0);

    expect(store.getCurrentState()).toBe(1);

    store.dispatch(2);

    expect(reducerSpy.calls.count()).toBe(1);
    expect(reducerSpy).toHaveBeenCalledWith(1, 2);
    expect(store.getCurrentState()).toBe(3);
  });

  it('eventlisteners are called when change happened', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const store = redchain(null, reducerSpy);
    store.subscribe(firstEventListenerSpy);
    store.subscribe(secondEventListenerSpy);

    expect(store.getCurrentState()).toBe(null);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    store.dispatch(action);

    expect(store.getCurrentState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
    expect(secondEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('eventlisteners are not called when no change happened', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};
    const store = redchain(action, reducerSpy);
    store.subscribe(firstEventListenerSpy);
    store.subscribe(secondEventListenerSpy);

    expect(store.getCurrentState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    store.dispatch(action);

    expect(store.getCurrentState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);
  });

  it('eventlisteners are not called when no change happened', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};
    const store = redchain(action, reducerSpy);
    store.subscribe(firstEventListenerSpy);
    store.subscribe(secondEventListenerSpy);

    expect(store.getCurrentState()).toBe(action);

    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    store.dispatch(action);

    expect(store.getCurrentState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);
  });

  it('eventlistener removed even while dispatched', () => {
    const reducerSpy = jasmine.createSpy('reducer', (_originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {
      store.unsubscribe(secondEventListenerSpy);
    }).and.callThrough();
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const store = redchain(null, reducerSpy);
    store.subscribe(firstEventListenerSpy);
    store.subscribe(secondEventListenerSpy);

    expect(store.getCurrentState()).toBe(null);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    store.dispatch(action);

    expect(store.getCurrentState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(0);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('eventlistener removed even while dispatched', () => {
    const reducerSpy = jasmine.createSpy('reducer', (_originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {
      store.unsubscribe(firstEventListenerSpy);
    }).and.callThrough();
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const store = redchain(null, reducerSpy);
    store.subscribe(firstEventListenerSpy);
    store.subscribe(secondEventListenerSpy);

    expect(store.getCurrentState()).toBe(null);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    store.dispatch(action);

    expect(store.getCurrentState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('eventlistener removed even while dispatched', () => {
    const reducerSpy = jasmine.createSpy('reducer', (_originalState: number, action: number) => action).and.callThrough();

    const zeroEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {
      store.unsubscribe(firstEventListenerSpy);
    }).and.callThrough();
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const store = redchain(null, reducerSpy);
    store.subscribe(zeroEventListenerSpy);
    store.subscribe(firstEventListenerSpy);
    store.subscribe(secondEventListenerSpy);

    expect(store.getCurrentState()).toBe(null);
    expect(zeroEventListenerSpy.calls.count()).toBe(0);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    store.dispatch(action);

    expect(store.getCurrentState()).toBe(action);
    expect(zeroEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('flush all changelisteners', () => {
    const store = redchain(0, (_state, action: number) => action);

    const listenerSpy = jasmine.createSpy('listener', () => null);

    store.subscribe(listenerSpy);

    store.flush();

    store.dispatch(1);

    expect(listenerSpy.calls.count()).toBe(0);
  });

  it('get state from observer', () => {
    const store = redchain(0, (_state, action: number) => action);

    expect(store.Observer.getCurrentState()).toBe(0);

    store.dispatch(1);

    expect(store.Observer.getCurrentState()).toBe(1);
  });
});
