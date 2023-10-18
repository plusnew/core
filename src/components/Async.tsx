import { computed } from "@preact/signals-core";
import type { Props } from "../index";
import type ComponentInstance from "../instances/types/Component/Instance";
import { active } from "../instances/types/Component/Instance";
import type { ApplicationElement } from "../interfaces/component";
import AbstractClass from "./AbstractClass";

type renderFunction<T> = (value: T) => ApplicationElement;
type props<T> = {
  children: renderFunction<T>;
  constructor: () => Promise<T>;
  pendingIndicator: ApplicationElement;
};

class Async<T> extends AbstractClass<props<T>> {
  instance?: ComponentInstance<props<T>, unknown, unknown>;

  static displayName = "Async";

  private promiseResolve:
    | { isResolved: false }
    | { isResolved: true; payload: T } = { isResolved: false };

  render(
    Props: Props<props<T>>,
    instance: ComponentInstance<props<T>, unknown, unknown>
  ) {
    this.instance = instance;
    let errored = false;
    const asyncPromise = Props.getState()
      .constructor()
      .catch((reason) => {
        errored = true;
        /* istanbul ignore else */
        if (instance.renderOptions.invokeGuard) {
          instance.renderOptions.invokeGuard(() => {
            throw reason;
          }, instance);
        } else {
          throw reason;
        }
      })
      .then((value) => {
        if (errored === false) {
          this.promiseResolve = { isResolved: true, payload: value as T };
          this.update();
        }
      });

    if (instance.renderOptions.addAsyncListener) {
      instance.renderOptions.addAsyncListener(asyncPromise);
    }

    this.instance.storeProps.subscribe(this.update);

    return this.instance.props.pendingIndicator;
  }

  private update = async () => {
    const instance = this.instance as ComponentInstance<
      props<T>,
      unknown,
      unknown
    >;
    instance.disconnectSignal();

    const computedResult = computed(() => {
      const renderFunction = (
        instance.props.children as any
      )[0] as renderFunction<T>;

      active.renderingComponent = instance;
      let result: { hasError: boolean; result?: any };

      if (this.promiseResolve.isResolved) {
        const payload = this.promiseResolve.payload;

        if (instance.renderOptions.invokeGuard === undefined) {
          try {
            result = {
              hasError: false as const,
              result: renderFunction(payload),
            };
          } catch (errored) {
            result = { hasError: true as const, result: errored };
          }
        } else {
          result = instance.renderOptions.invokeGuard(
            () => renderFunction(payload),
            instance
          );
        }

        return result;
      } else {
        result = {
          hasError: false,
          result: instance.props.pendingIndicator,
        };
      }

      active.renderingComponent = null;

      return result;
    });

    instance.disconnectSignal = computedResult.subscribe((value) => {
      if (instance.rendered && instance.mounted && value.hasError === false) {
        instance.render(value.result);
      }
    });
  };

  /**
   * unregisters the event
   */
  public componentWillUnmount() {
    (
      this.instance as ComponentInstance<props<T>, unknown, unknown>
    ).storeProps.unsubscribe(this.update);
  }
}

export default Async;
