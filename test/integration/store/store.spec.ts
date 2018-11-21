import { store } from 'index';

describe('reducer', () => {
  it('is the reducer correctly called', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => {
      return originalState + action;
    }).and.callThrough();

    const local = store(1, reducerSpy);

    expect(reducerSpy.calls.count()).toBe(0);

    expect(local.getState()).toBe(1);

    local.dispatch(2);

    expect(reducerSpy.calls.count()).toBe(1);
    expect(reducerSpy).toHaveBeenCalledWith(1, 2);
    expect(local.getState()).toBe(3);
  });

  it('short store, dispatched value to be new state', () => {
    const local = store(1);

    expect(local.getState()).toBe(1);

    local.dispatch(2);

    expect(local.getState()).toBe(2);
  });

  it('eventlisteners are called when change happened', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const local = store(null, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
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
    const local = store(action, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);
  });

  it('eventlisteners are not called when no change happened', () => {
    const reducerSpy = jasmine.createSpy('reducer', (originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};
    const local = store(action, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(action);

    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);
  });

  it('eventlistener removed even while dispatched', () => {
    const reducerSpy = jasmine.createSpy('reducer', (_originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {
      local.unsubscribe(secondEventListenerSpy);
    }).and.callThrough();
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const local = store(null, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(0);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('eventlistener removed even while dispatched', () => {
    const reducerSpy = jasmine.createSpy('reducer', (_originalState: number, action: number) => action).and.callThrough();

    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {
      local.unsubscribe(firstEventListenerSpy);
    }).and.callThrough();
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const local = store(null, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('eventlistener removed even while dispatched', () => {
    const reducerSpy = jasmine.createSpy('reducer', (_originalState: number, action: number) => action).and.callThrough();

    const zeroEventListenerSpy = jasmine.createSpy('eventlistener', () => {});
    const firstEventListenerSpy = jasmine.createSpy('eventlistener', () => {
      local.unsubscribe(firstEventListenerSpy);
    }).and.callThrough();
    const secondEventListenerSpy = jasmine.createSpy('eventlistener', () => {});

    const action = {};

    const local = store(null, reducerSpy);
    local.subscribe(zeroEventListenerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(zeroEventListenerSpy.calls.count()).toBe(0);
    expect(firstEventListenerSpy.calls.count()).toBe(0);
    expect(secondEventListenerSpy.calls.count()).toBe(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(zeroEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy.calls.count()).toBe(1);
    expect(secondEventListenerSpy.calls.count()).toBe(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it('flush all changelisteners', () => {
    const local = store(0, (_state, action: number) => action);

    const listenerSpy = jasmine.createSpy('listener', () => null);

    local.subscribe(listenerSpy);

    local.flush();

    local.dispatch(1);

    expect(listenerSpy.calls.count()).toBe(0);
  });

  it('get state from observer', () => {
    const local = store(0, (_state, action: number) => action);

    expect(local.Observer.getState()).toBe(0);

    local.dispatch(1);

    expect(local.Observer.getState()).toBe(1);
  });
});
