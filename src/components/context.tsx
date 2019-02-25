import plusnew, { ApplicationElement, Component, ComponentContainer, Instance, Props } from '../';
import ComponentInstance from '../instances/types/Component/Instance';
import { storeType } from '../util/store';

type renderProps<state, action> = (state: state, dispatch: (action: action) => boolean) => ApplicationElement ;
type providerProps<state, action> = {state: state, dispatch: (action: action) => boolean, children: ApplicationElement};
type consumerProps<state, action> = {children: renderProps<state, action>};
type contextEntity<state, action> = {
  Provider: ComponentContainer<providerProps<state, action>>;
  Consumer: ComponentContainer<consumerProps<state, action>>;
};

function context<stateType, actionType>(): contextEntity<stateType, actionType> {
  function search(target: Instance | ComponentInstance<any>): ComponentInstance<providerProps<stateType, actionType>> {
    if (target instanceof ComponentInstance && target.applicationInstance instanceof Provider) {
      return target;
    }
    if (target.parentInstance) {
      return search(target.parentInstance);
    }

    throw new Error('Could not find Provider');
  }

  class Provider extends Component<providerProps<stateType, actionType>> {
    static displayName = 'Provider';
    render(Props: Props<providerProps<stateType, actionType>>) {
      return <Props>{props => props.children}</Props>;
    }
  }

  const result = {
    Provider,
    Consumer: class Consumer extends Component<consumerProps<stateType, actionType>> {
      static displayName = 'Consumer';
      private instance: ComponentInstance<consumerProps<stateType, actionType>>;
      private providerPropsStore: storeType<providerProps<stateType, actionType>, any>;

      private getRenderPropsResult() {
        const [renderProps]: [renderProps<stateType, actionType>] = this.instance.props.children as any;
        const providerPropsState = this.providerPropsStore.getState();
        return renderProps(providerPropsState.state, providerPropsState.dispatch);
      }

      private update = () => {
        this.instance.render(this.getRenderPropsResult());
      }
      render(_Props: Props<consumerProps<stateType, actionType>>, componentInstance: ComponentInstance<any>) {
        this.instance = componentInstance;
        this.providerPropsStore = search(componentInstance).storeProps;
        this.providerPropsStore.subscribe(this.update);
        return this.getRenderPropsResult();
      }
      componentWillUnmount() {
        this.providerPropsStore.unsubscribe(this.update);
      }
    },
  };

  return result;
}

export default context;
