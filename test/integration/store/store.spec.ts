import { store } from "../../../index";

describe("reducer", () => {
  it("is the reducer correctly called", () => {
    const reducerSpy = jest.fn((originalState: number, action: number) => {
      return originalState + action;
    });

    const local = store(1, reducerSpy);

    expect(reducerSpy).toHaveBeenCalledTimes(0);

    expect(local.getState()).toBe(1);

    local.dispatch(2);

    expect(reducerSpy).toHaveBeenCalledTimes(1);
    expect(reducerSpy).toHaveBeenCalledWith(1, 2);
    expect(local.getState()).toBe(3);
  });

  it("short store, dispatched value to be new state", () => {
    const local = store(1);

    expect(local.getState()).toBe(1);

    local.dispatch(2);

    expect(local.getState()).toBe(2);
  });

  it("eventlisteners are called when change happened", () => {
    const reducerSpy = jest.fn(
      (_originalState: null | {}, action: {}) => action
    );

    const firstEventListenerSpy = jest.fn((_action: {}) => {});
    const secondEventListenerSpy = jest.fn((_action: {}) => {});

    const action = {};

    const local = store<null | {}, {}>(null, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
    expect(secondEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it("eventlisteners are not called when no change happened", () => {
    const reducerSpy = jest.fn((_originalState: {}, action: {}) => action);

    const firstEventListenerSpy = jest.fn(() => {});
    const secondEventListenerSpy = jest.fn(() => {});

    const action = {};
    const local = store(action, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);
  });

  it("eventlisteners are not called when no change happened", () => {
    const reducerSpy = jest.fn((_originalState: {}, action: {}) => action);

    const firstEventListenerSpy = jest.fn(() => {});
    const secondEventListenerSpy = jest.fn(() => {});

    const action = {};
    const local = store(action, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(action);

    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);
  });

  it("eventlistener removed even while dispatched", () => {
    const reducerSpy = jest.fn(
      (_originalState: null | {}, action: {}) => action
    );

    const firstEventListenerSpy = jest.fn((_action: {}) => {
      local.unsubscribe(secondEventListenerSpy);
    });

    const secondEventListenerSpy = jest.fn((_action: {}) => {});

    const action = {};

    const local = store<null | {}, {}>(null, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it("eventlistener removed even while dispatched", () => {
    const reducerSpy = jest.fn(
      (_originalState: null | {}, action: {}) => action
    );

    const firstEventListenerSpy = jest.fn((_action: {}) => {
      local.unsubscribe(firstEventListenerSpy);
    });

    const secondEventListenerSpy = jest.fn((_action: {}) => {});

    const action = {};

    const local = store<{} | null, {}>(null, reducerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it("eventlistener removed even while dispatched", () => {
    const reducerSpy = jest.fn(
      (_originalState: {} | null, action: {}) => action
    );

    const zeroEventListenerSpy = jest.fn((_action: {}) => {});
    const firstEventListenerSpy = jest.fn((_action: {}) => {
      local.unsubscribe(firstEventListenerSpy);
    });

    const secondEventListenerSpy = jest.fn(() => {});

    const action = {};

    const local = store<{} | null, {}>(null, reducerSpy);
    local.subscribe(zeroEventListenerSpy);
    local.subscribe(firstEventListenerSpy);
    local.subscribe(secondEventListenerSpy);

    expect(local.getState()).toBe(null);
    expect(zeroEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(0);

    local.dispatch(action);

    expect(local.getState()).toBe(action);
    expect(zeroEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(firstEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(secondEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(firstEventListenerSpy).toHaveBeenCalledWith(action);
  });

  it("flush all changelisteners", () => {
    const local = store(0, (_state, action: number) => action);

    const listenerSpy = jest.fn(() => null);

    local.subscribe(listenerSpy);

    local.flush();

    local.dispatch(1);

    expect(listenerSpy).toHaveBeenCalledTimes(0);
  });

  it("get state from observer", () => {
    const local = store(0, (_state, action: number) => action);

    expect(local.Observer.getState()).toBe(0);

    local.dispatch(1);

    expect(local.Observer.getState()).toBe(1);
  });
});
