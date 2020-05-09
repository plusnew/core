import type { Props } from "../index";
import type ComponentInstance from "../instances/types/Component/Instance";
import type { ApplicationElement } from "../interfaces/component";
// import type { invokeGuard } from "../interfaces/renderOptions";
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

    if (this.promiseResolve.isResolved) {
      const payload = this.promiseResolve.payload;
      if (instance.mounted) {
        if (instance.renderOptions.invokeGuard) {
          const result = instance.renderOptions.invokeGuard(
            () =>
              ((instance.props.children as any)[0] as renderFunction<T>)(
                payload
              ),
            instance
          );
          if (result.hasError === false) {
            instance.render(result.result);
          }
        } else {
          instance.render(
            ((instance.props.children as any)[0] as renderFunction<T>)(payload)
          );
        }
      }
    } else {
      instance.render(instance.props.pendingIndicator);
    }
  };

  /**
   * unregisters the event
   */
  public componentWillUnmount() {
    (this.instance as ComponentInstance<
      props<T>,
      unknown,
      unknown
    >).storeProps.unsubscribe(this.update);
  }
}

export default Async;
