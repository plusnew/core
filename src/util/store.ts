import { ComponentContainer } from '../components/factory';
import { ApplicationElement } from '../interfaces/component';
import observerFactory from '../components/observerFactory';

export type Observer<state> = ComponentContainer<{children: (state: state) => ApplicationElement}, unknown, unknown> & { getState(): state };

export type onChangeCallback<actionType> = ((lastAction: actionType) => void);

/**
 * gets called when a dispatch with an action is triggered
 */
export type reducer<stateType, actionType> = {
  (previousState: stateType, action: actionType): stateType;
};

export type Store<stateType, actionType> = {
  Observer: Observer<stateType>;
  /**
   * this value gets replaced, each time the reducer gets called
   */
  getState: () => stateType;

  /**
   *  when the state property should change, thats the way to call it
   */
  dispatch(action: actionType): boolean;

  /**
   *  eventlisteners when a dispatch caused a change in state
   */
  subscribe(onChange: onChangeCallback<actionType>): void;

  /**
   * when a eventlistener is not needed, this function should get called
   */
  unsubscribe(removeOnChange: onChangeCallback<actionType>): boolean;

  /**
   * flushes all existing eventlisteners
   */
  flush(): void;
};

function store<stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): Store<stateType, actionType>;
function store<stateType>(initValue: stateType): Store<stateType, stateType>;
function store<stateType, actionType>(initValue: stateType, reducer?: reducer<stateType, actionType>): Store<stateType, actionType>  {

  let subscribes: onChangeCallback<actionType>[] = [];
  let state = initValue;

  const result: Store<stateType, actionType> = {
    /**
     * holds the actual value of the current store
     */
    getState: () => state,

    /**
     * takes listeners, when the reducer returnvalue is triggered they
     */
    subscribe(onChange: onChangeCallback<actionType>) {
      subscribes.push(onChange);
    },

    /**
     * takes listeners, when the reducer returnvalue is triggered they
     * and returns true, when something changed
     */
    unsubscribe(removeOnChange: onChangeCallback<actionType>) {
      const previousLength = subscribes.length;
      subscribes = subscribes.filter((currentOnChange: onChangeCallback<actionType>) => currentOnChange !== removeOnChange);

      return previousLength !== subscribes.length;
    },

    /**
     * flushes all existing eventlisteners
     */
    flush() {
      subscribes = [];
    },

    /**
     * this function triggers the reducer
     * when the returnvalue is unequal to the previous state it will trigger the listeners from addOnChange
     */
    dispatch: (action: actionType) => {
      let currentState: stateType;
      if (reducer) {
        currentState = reducer(state, action);
      } else {
        // in case the reducer isn't existent, the action is the new value
        currentState = action as any;
      }

      // @TODO change to Object.is
      if (state !== currentState) {
        state = currentState;

        const calledOnChanges: onChangeCallback<actionType>[] = [];
        for (let i = 0; i < subscribes.length; i += 1) {
          const onChange = subscribes[i];

          if (calledOnChanges.indexOf(onChange) === -1) {
            // currently no other listeners will get notified, when the following line will fuck up
            // try-catch should be avoided, to improve debuggability
            // setTimeout would break the call-stack
            // If you have an opinion on this matter, please make a github issue and tell me
            onChange(action);
            calledOnChanges.push(onChange);

            if (onChange !== subscribes[i]) {
              // Reset if onchange removed itself
              i = -1;
            }
          }
        }

        return true;
      }

      return false;
    },

    Observer: null as any,
  };

  result.Observer = observerFactory(result);

  return result;
}

export default store;
