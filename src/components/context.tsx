import store, { reducer } from '../util/store';
import { ComponentContainer, ApplicationElement } from '../';

type contextEntity<state, action> = {
  Consumer: ComponentContainer<{children: (state: state, dispatch: (action: action) => boolean) => ApplicationElement }>;
  Provider: ComponentContainer<{children: ApplicationElement}>
};

function context<stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): contextEntity<stateType, actionType>;
function context<stateType>(initValue: stateType): contextEntity<stateType, stateType>;
function context<stateType, actionType>(initValue: stateType, reducer?: reducer<stateType, actionType>): contextEntity<stateType, actionType>;
function context() {

  return {};
}

export default context;
