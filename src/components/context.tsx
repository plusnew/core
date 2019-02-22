import store, { reducer } from '../util/store';
import { ComponentContainer, ApplicationElement, component } from '../';

type contextEntity<state, action> = {
  Provider: ComponentContainer<{children: ApplicationElement}>;
  Consumer: ComponentContainer<{children: (state: state, dispatch: (action: action) => boolean) => ApplicationElement }>;
};

function context<stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): contextEntity<stateType, actionType>;
function context<stateType>(initValue: stateType): contextEntity<stateType, stateType>;
function context<stateType, actionType>(initValue: stateType, reducer?: reducer<stateType, actionType>): contextEntity<stateType, actionType>;
function context() {
  const identifier = Symbol('context');

  return {

  };
}

export default context;
