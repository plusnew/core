import { Props, Component, ApplicationElement } from '../index';
import ComponentInstance from '../instances/types/Component/Instance';

type renderFunction = () => ApplicationElement;

type props = {
  catch: () => ApplicationElement;
  children: renderFunction;
};

export default class Try extends Component<props> {
  static displayName = 'ComponentName';

  private instance: ComponentInstance<props>;
  private errored = false;

  public invokeGuard<T>(callback: () => T): { hasError: true } | { hasError: false, result: T } {
    let hasError = false;
    const errorChecker = () => {
      hasError = true;
    };

    let result: any;

    const callCallback = () => {
      result = callback();
    };

    window.addEventListener('error', errorChecker);

    const fakeElement = document.createElement('plusnew');
    fakeElement.addEventListener('guard', callCallback);
    fakeElement.dispatchEvent(new Event('guard'));
    fakeElement.removeEventListener('guard', callCallback);

    window.removeEventListener('error', errorChecker);

    if (hasError as boolean === true) {
      this.errored = true;
      this.update();
      return {
        hasError: true,
      };
    }
    return {
      result: result as T,
      hasError: false,
    };
  }

  private setInvokeGuard() {
    if (this.errored) {
      this.instance.invokeGuard = (this.instance.parentInstance as ComponentInstance<any>).invokeGuard;
    } else {
      this.instance.invokeGuard = this.invokeGuard.bind(this);
    }
  }

  private update = () => {
    this.instance.invokeGuard = this.invokeGuard.bind(this);

    let result: ApplicationElement;

    if (this.errored) {
      result = this.instance.props.catch();
    } else {
      try {
        result = ((this.instance.props.children as any)[0] as renderFunction)();
      } catch (error) {
        this.errored = true;
        this.setInvokeGuard();

        result = this.instance.props.catch();
      }
    }

    this.instance.render(result);
  }

  componentWillUnmount() {
    this.instance.storeProps.unsubscribe(this.update);
  }

  render(Props: Props<props>, instance: ComponentInstance<props>) {
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
