import plusnew, { Component } from "../";
import type { ApplicationElement, ComponentContainer, Props } from "../";
import ComponentInstance, {
  active,
} from "../instances/types/Component/Instance";
import type Instance from "../instances/types/Instance";
import type { Store } from "../util/store";
import { computed } from "@preact/signals-core";

type renderProps<state, action> = (
  state: state,
  dispatch: (action: action) => void
) => ApplicationElement;
type providerProps<state, action> = {
  state: state;
  dispatch: (action: action) => void;
  children: ApplicationElement;
};
type consumerProps<state, action> = { children: renderProps<state, action> };
export type Context<state, action> = {
  Provider: ComponentContainer<providerProps<state, action>, unknown, unknown>;
  Consumer: ComponentContainer<consumerProps<state, action>, unknown, unknown>;
  findProvider: (instance: Instance<unknown, unknown>) => {
    getState: () => state;
    dispatch: (action: action) => void;
  };
};

function context<stateType, actionType>(): Context<stateType, actionType> {
  class Provider extends Component<providerProps<stateType, actionType>> {
    static displayName = "Provider";
    render(Props: Props<providerProps<stateType, actionType>>) {
      return <Props>{(props) => props.children}</Props>;
    }
  }

  const findProvider = (componentInstance: Instance<unknown, unknown>) => {
    const providerInstance = componentInstance.findParent(
      (instance) =>
        instance instanceof ComponentInstance && instance.type === Provider
    );
    if (providerInstance === undefined) {
      throw new Error("Could not find Provider");
    }

    return providerInstance as ComponentInstance<
      providerProps<stateType, actionType>,
      unknown,
      unknown
    >;
  };

  const result: Context<stateType, actionType> = {
    Provider,
    Consumer: class Consumer extends Component<
      consumerProps<stateType, actionType>
    > {
      static displayName = "Consumer";
      private instance?: ComponentInstance<
        consumerProps<stateType, actionType>,
        unknown,
        unknown
      >;
      private providerPropsStore?: Store<
        providerProps<stateType, actionType>,
        any
      >;

      render(
        _Props: Props<consumerProps<stateType, actionType>>,
        componentInstance: ComponentInstance<any, unknown, unknown>
      ) {
        this.instance = componentInstance;

        this.providerPropsStore = findProvider(componentInstance).storeProps;
        (
          this.providerPropsStore as Store<
            providerProps<stateType, actionType>,
            any
          >
        ).subscribe(this.update);
        componentInstance.storeProps.subscribe(this.update);

        const renderResult = this.update();
        if (renderResult.hasError) {
          throw (renderResult as any).result;
        }
        return renderResult.result;
      }

      private update = () => {
        const instance = this.instance as ComponentInstance<
          consumerProps<stateType, actionType>,
          unknown,
          unknown
        >;
        instance.disconnectSignal();

        const computedResult = computed(() => {
          const [renderFunction]: [renderProps<stateType, actionType>] =
            instance.props.children as any;
          const providerPropsState = (
            this.providerPropsStore as Store<
              providerProps<stateType, actionType>,
              any
            >
          ).getState();

          active.renderingComponent = instance;
          let result: { hasError: boolean; result?: any };

          if (
            instance.rendered === undefined ||
            instance.renderOptions.invokeGuard === undefined
          ) {
            try {
              result = {
                hasError: false as const,
                result: renderFunction(
                  providerPropsState.state,
                  providerPropsState.dispatch
                ),
              };
            } catch (errored) {
              result = { hasError: true as const, result: errored };
            }
          } else {
            result = instance.renderOptions.invokeGuard(
              () =>
                renderFunction(
                  providerPropsState.state,
                  providerPropsState.dispatch
                ),
              instance
            );
          }

          active.renderingComponent = null;

          return result;
        });

        instance.disconnectSignal = computedResult.subscribe((value) => {
          if (instance.rendered && value.hasError === false) {
            instance.render(value.result);
          }
        });

        return computedResult.peek();
      };

      componentWillUnmount(
        _Props: consumerProps<stateType, actionType>,
        componentInstance: ComponentInstance<any, unknown, unknown>
      ) {
        (
          this.providerPropsStore as Store<
            providerProps<stateType, actionType>,
            any
          >
        ).unsubscribe(this.update);
        componentInstance.storeProps.unsubscribe(this.update);
      }
    },
    findProvider: (componentInstance) => {
      const providerInstance = findProvider(componentInstance);

      return {
        getState: () => providerInstance.props.state,
        dispatch: providerInstance.props.dispatch,
      };
    },
  };

  return result;
}

export default context;
