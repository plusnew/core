import { computed } from "@preact/signals-core";
import type ComponentInstance from "../instances/types/Component/Instance";
import { active } from "../instances/types/Component/Instance";
import type { ApplicationElement } from "../interfaces/component";
import type { Store } from "../util/store";
import AbstractClass from "./AbstractClass";

type renderFunction<state> = (state: state) => ApplicationElement;

export type observerProps<state> = {
  children: renderFunction<state>;
};

export default function <state>(store: Store<state, any>) {
  return class Observer extends AbstractClass<observerProps<state>> {
    instance?: ComponentInstance<observerProps<state>, unknown, unknown>;
    static displayName = "Observer";
    public render(
      _props: any,
      instance: ComponentInstance<observerProps<state>, unknown, unknown>
    ) {
      this.instance = instance;

      store.subscribe(this.update);
      instance.storeProps.subscribe(this.update);

      const renderResult = this.update();
      if (renderResult.hasError) {
        throw (renderResult as any).result;
      }
      return renderResult.result;
    }

    private update = () => {
      const instance = this.instance as ComponentInstance<
        observerProps<state>,
        unknown,
        unknown
      >;
      instance.disconnectSignal();

      const computedResult = computed(() => {
        const renderFunction = (
          instance.props.children as any
        )[0] as renderFunction<state>;

        active.renderingComponent = instance;
        let result: { hasError: boolean; result?: any };

        if (
          instance.rendered === undefined ||
          instance.renderOptions.invokeGuard === undefined
        ) {
          try {
            result = {
              hasError: false as const,
              result: renderFunction(store.getState()),
            };
          } catch (errored) {
            result = { hasError: true as const, result: errored };
          }
        } else {
          result = instance.renderOptions.invokeGuard(
            () => renderFunction(store.getState()),
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

    /**
     * unregisters the event
     */
    public componentWillUnmount() {
      store.unsubscribe(this.update);
      // @FIXME this cast should be removed and typechecked
      (
        this.instance as ComponentInstance<
          observerProps<state>,
          unknown,
          unknown
        >
      ).storeProps.unsubscribe(this.update);
    }

    /**
     * this component should event be created in shallow mode
     */
    static shouldCreateComponent() {
      return true;
    }

    /**
     * returns the current state of the store
     * if you want to have the state when it changes, better observe the store
     */
    static getState() {
      return store.getState();
    }
  };
}
