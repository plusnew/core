import { Props, Component, ApplicationElement } from '../index';
import ComponentInstance from '../instances/types/Component/Instance';

type renderFunction = () => ApplicationElement;

type props = {
  catch: () => ApplicationElement;
  children: renderFunction;
};

export default class Try extends Component<props> {
  static displayName = 'Try';

  private instance?: ComponentInstance<props, any, any>;
  private errored = false;

  public invokeGuard<T>(callback: () => T): { hasError: true } | { hasError: false, result: T } {
    try {
      return {
        hasError: false,
        result: callback(),
      };
    } catch (error) {
      this.errored = true;
      this.update();

      return {
        hasError: true,
      };
    }
  }

  private setInvokeGuard() {
    const instance = this.instance as ComponentInstance<props, unknown, unknown>;

    if (this.errored) {
      instance.renderOptions = {
        ...instance.renderOptions,
        invokeGuard: (instance.parentInstance as ComponentInstance<any, any, any>).renderOptions.invokeGuard,
      };
    } else {
      instance.renderOptions = {
        ...instance.renderOptions,
        invokeGuard: this.invokeGuard.bind(this),
      };
    }
  }

  private update = () => {
    const instance = this.instance as ComponentInstance<props, unknown, unknown>;

    instance.renderOptions = {
      ...instance.renderOptions,
      invokeGuard: this.invokeGuard.bind(this),
    };

    let result: ApplicationElement;

    if (this.errored) {
      result = instance.props.catch();
    } else {
      try {
        result = ((instance.props.children as any)[0] as renderFunction)();
      } catch (error) {
        this.errored = true;
        this.setInvokeGuard();

        result = instance.props.catch();
      }
    }

    instance.render(result);
  }

  componentWillUnmount() {
    (this.instance as ComponentInstance<props, unknown, unknown>).storeProps.unsubscribe(this.update);
  }

  render(Props: Props<props>, instance: ComponentInstance<props, any, any>) {
    this.instance = instance;

    this.instance.storeProps.subscribe(this.update);
    this.setInvokeGuard();

    try {
      return ((Props.getState().children as any)[0] as renderFunction)();
    } catch (error) {
      this.errored = true;
      this.setInvokeGuard();

      return Props.getState().catch();
    }
  }
}
