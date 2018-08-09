import { ComponentContainer } from '../components/factory';
import { ApplicationElement } from '../interfaces/component';
import observerFactory from '../components/observerFactory';

export type Observer<state> = ComponentContainer<{render: (state: state) => ApplicationElement}> & { getCurrentState(): state };

export type onChangeCallback<actionType> = ((lastAction: actionType) => void);

/**
 * gets called when a dispatch with an action is triggered
 */
export interface reducer<stateType, actionType> {
  (previousState: stateType, action: actionType): stateType;
}

/**
 * thats how a complete store is organized
 */
export interface redchain {
  <stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): storeType<stateType, actionType>;
}

export interface storeType<stateType, actionType> {
  Observer: Observer<stateType>;
  /**
   * this value gets replaced, each time the reducer gets called
   */
  getCurrentState: () => stateType;

  /**
   *  when the state property should change, thats the way to call it
   */
  dispatch(action: actionType): boolean;

  /**
   *  eventlisteners when a dispatch caused a change in state
   */
  addOnChange(onChange: onChangeCallback<actionType>): void;

  /**
   * when a eventlistener is not needed, this function should get called
   */
  removeOnChange(removeOnChange: onChangeCallback<actionType>): boolean;

  /**
   * flushes all existing eventlisteners
   */
  flush(): void;
}

const store: redchain = <stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): storeType<stateType, actionType> => {

  let onChanges: onChangeCallback<actionType>[] = [];
  let state = initValue;

  const result: storeType<stateType, actionType> = {
    /**
     * holds the actual value of the current store
     */
    getCurrentState: () => state,

    /**
     * takes listeners, when the reducer returnvalue is triggered they
     */
    addOnChange(onChange: onChangeCallback<actionType>) {
      onChanges.push(onChange);
    },

    /**
     * takes listeners, when the reducer returnvalue is triggered they
     * and returns true, when something changed
     */
    removeOnChange(removeOnChange: onChangeCallback<actionType>) {
      const previousLength = onChanges.length;
      onChanges = onChanges.filter((currentOnChange: onChangeCallback<actionType>) => currentOnChange !== removeOnChange);

      return previousLength !== onChanges.length;
    },

    /**
     * flushes all existing eventlisteners
     */
    flush() {
      onChanges = [];
    },

    /**
     * this function triggers the reducer
     * when the returnvalue is unequal to the previous state it will trigger the listeners from addOnChange
     */
    dispatch: (action: actionType) => {
      const currentState = reducer(state, action);

      // @TODO change to Object.is
      if (state !== currentState) {
        state = currentState;

        const calledOnChanges: onChangeCallback<actionType>[] = [];
        for (let i = 0; i < onChanges.length; i += 1) {
          const onChange = onChanges[i];

          if (calledOnChanges.indexOf(onChange) === -1) {
            // currently no other listeners will get notified, when the following line will fuck up
            // try-catch should be avoided, to improve debuggability
            // setTimeout would break the call-stack
            // If you have an opinion on this matter, please make a github issue and tell me
            onChange(action);
            calledOnChanges.push(onChange);

            if (onChange !== onChanges[i]) {
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
};

export default store;
