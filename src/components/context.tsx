import store, { reducer, storeType } from '../util/store';
import plusnew, { ComponentContainer, ApplicationElement, Component, Props, Instance } from '../';
import ComponentInstance from '../instances/types/Component/Instance';

type providerProps = {children: ApplicationElement};
type consumerProps<state, action> = {children: (state: state, dispatch: (action: action) => boolean) => ApplicationElement };
type contextEntity<state, action> = {
  Provider: ComponentContainer<providerProps>;
  Consumer: ComponentContainer<consumerProps<state, action>>;
};

function context<stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): contextEntity<stateType, actionType>;
function context<stateType>(initValue: stateType): contextEntity<stateType, stateType>;
function context<stateType, actionType>(initValue: stateType, reducer?: reducer<stateType, actionType>): contextEntity<stateType, actionType> {
  function search(target: Instance | ComponentInstance<any>): storeType<stateType, stateType | actionType> {
    if (target instanceof ComponentInstance && target.applicationInstance instanceof Provider) {
      return target.applicationInstance.store;
    }
    if (target.parentInstance) {
      return search(target.parentInstance);
    }

    throw new Error('Could not find Provider');
  }

  class Provider extends Component<providerProps> {
    static displayName = "Provider";
    store: storeType<stateType, actionType | stateType>;
    render(Props: Props<providerProps>) {
      if (reducer) {
        this.store = store(initValue, reducer);
      } else {
        this.store = store(initValue);
      }

      return <Props>{props => props.children}</Props>;
    }
  }

  const result = {
    Provider: Provider,
    Consumer: class Consumer extends Component<consumerProps<stateType, actionType>> {
      static displayName = "Consumer";
      render(Props: Props<consumerProps<stateType, actionType>>, componentInstance: ComponentInstance<any>) {
        search(componentInstance);
        return null;
      }
    }
  };

  return result;
}

export default context;
