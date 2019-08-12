import plusnew, { ApplicationElement, Component, ComponentContainer, Props, Instance } from '../';
import ComponentInstance from '../instances/types/Component/Instance';
import { storeType } from '../util/store';

type renderProps<state, action> = (state: state, dispatch: (action: action) => void) => ApplicationElement ;
type providerProps<state, action> = {state: state, dispatch: (action: action) => void, children: ApplicationElement};
type consumerProps<state, action> = {children: renderProps<state, action>};
type contextEntity<state, action> = {
  Provider: ComponentContainer<providerProps<state, action>>;
  Consumer: ComponentContainer<consumerProps<state, action>>;
  findProvider: (instance: Instance) => ComponentInstance<providerProps<state, action>>
};

function context<stateType, actionType>(): contextEntity<stateType, actionType> {
  class Provider extends Component<providerProps<stateType, actionType>> {
    static displayName = 'Provider';
    render(Props: Props<providerProps<stateType, actionType>>) {
      return <Props>{props => props.children}</Props>;
    }
  }

  const findProvider = (componentInstance: Instance) => {
    const providerInstance = componentInstance.find(instance => instance instanceof ComponentInstance && instance.type === Provider);
    if (providerInstance === undefined) {
      throw new Error('Could not find Provider');
    }

    return providerInstance as ComponentInstance<providerProps<stateType, actionType>>;
  };

  const result: contextEntity<stateType, actionType> = {
    findProvider,
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
        if (this.instance.renderOptions.invokeGuard === undefined) {
          this.instance.render(
            this.getRenderPropsResult(),
          );
        } else {
          const invokeHandle = this.instance.renderOptions.invokeGuard(() => this.getRenderPropsResult());
          if (invokeHandle.hasError === false) {
            this.instance.render(invokeHandle.result);
          }
        }
      }

      render(_Props: Props<consumerProps<stateType, actionType>>, componentInstance: ComponentInstance<any>) {
        this.instance = componentInstance;

        this.providerPropsStore = findProvider(componentInstance).storeProps;
        this.providerPropsStore.subscribe(this.update);
        componentInstance.storeProps.subscribe(this.update);

        return this.getRenderPropsResult();
      }
      componentWillUnmount(_Props: consumerProps<stateType, actionType>, componentInstance: ComponentInstance<any>) {
        this.providerPropsStore.unsubscribe(this.update);
        componentInstance.storeProps.unsubscribe(this.update);
      }
    },
  };

  return result;
}

export default context;
