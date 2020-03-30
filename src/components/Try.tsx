import type { ApplicationElement, Props } from "../";
import { Component } from "../index";
import type ComponentInstance from "../instances/types/Component/Instance";
import type { invokeGuard } from "../interfaces/renderOptions";

type renderFunction = () => ApplicationElement;

type props = {
  catch: (Error: any) => ApplicationElement;
  children: renderFunction;
};

export default class Try extends Component<props> {
  static displayName = "Try";

  private instance?: ComponentInstance<props, any, any>;
  private errored: any = null;

  constructor(
    props: props,
    componentInstance: ComponentInstance<props, any, any>
  ) {
    super(props, componentInstance);

    this.instance = componentInstance;
    this.setInvokeGuard();

    componentInstance.executeUserspace = () => {
      (componentInstance.renderOptions.invokeGuard as invokeGuard<unknown>)(
        () => {
          componentInstance.render(
            (componentInstance.applicationInstance as Component<
              props,
              any,
              any
            >).render(componentInstance.storeProps.Observer, componentInstance)
          );
          componentInstance.executeLifecycleHooks("componentDidMount");
        }
      );
    };
  }

  public invokeGuard<T>(
    callback: () => T
  ): { hasError: true; error: any } | { hasError: false; result: T } {
    try {
      return {
        hasError: false,
        result: callback(),
      };
    } catch (error) {
      this.errored = error;
      this.update();

      return {
        error,
        hasError: true,
      };
    }
  }

  private setInvokeGuard() {
    const instance = this.instance as ComponentInstance<
      props,
      unknown,
      unknown
    >;

    if (this.errored) {
      instance.renderOptions = {
        ...instance.renderOptions,
        invokeGuard: (instance.parentInstance as ComponentInstance<
          any,
          any,
          any
        >).renderOptions.invokeGuard,
      };
    } else {
      instance.renderOptions = {
        ...instance.renderOptions,
        invokeGuard: this.invokeGuard.bind(this),
      };
    }
  }

  private update = () => {
    const instance = this.instance as ComponentInstance<
      props,
      unknown,
      unknown
    >;

    instance.renderOptions = {
      ...instance.renderOptions,
      invokeGuard: this.invokeGuard.bind(this),
    };

    let result: ApplicationElement;

    if (this.errored === null) {
      try {
        result = ((instance.props.children as any)[0] as renderFunction)();
      } catch (error) {
        this.errored = error;
        this.setInvokeGuard();

        result = instance.props.catch(this.errored);
      }
    } else {
      result = instance.props.catch(this.errored);
    }

    instance.render(result);
  };

  componentWillUnmount() {
    (this.instance as ComponentInstance<
      props,
      unknown,
      unknown
    >).storeProps.unsubscribe(this.update);
  }

  render(Props: Props<props>, instance: ComponentInstance<props, any, any>) {
    instance.storeProps.subscribe(this.update);
    this.setInvokeGuard();

    try {
      return ((Props.getState().children as any)[0] as renderFunction)();
    } catch (error) {
      this.errored = error;
      this.setInvokeGuard();

      return Props.getState().catch(this.errored);
    }
  }
}
