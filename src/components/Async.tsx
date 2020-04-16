import type { Props } from "../index";
import type ComponentInstance from "../instances/types/Component/Instance";
import type { ApplicationElement } from "../interfaces/component";
import type { invokeGuard } from "../interfaces/renderOptions";
import AbstractClass from "./AbstractClass";

function tick() {
  return Promise.resolve();
}

type promiseGenerator = () => Promise<ApplicationElement>;
type props = {
  children: promiseGenerator;
  pendingIndicator: ApplicationElement;
};

class Async extends AbstractClass<props> {
  instance?: ComponentInstance<props, unknown, unknown>;

  static displayName = "Async";

  private increment = 0;

  render(
    _Props: Props<props>,
    instance: ComponentInstance<props, unknown, unknown>
  ) {
    this.instance = instance;
    this.instance.storeProps.subscribe(this.update);

    this.update();
    return this.instance.props.pendingIndicator;
  }

  private update = async () => {
    this.increment += 1;
    const currentIncrement = this.increment;

    let rendered = false;

    const instance = this.instance as ComponentInstance<
      props,
      unknown,
      unknown
    >;

    const asyncPromise = ((instance.props
      .children as any)[0] as promiseGenerator)().then((content) => {
      // Checks if between promise resolving, not another prop came
      // if inbetween a new render happened, then nothing should happen
      if (currentIncrement === this.increment && instance.mounted === true) {
        rendered = true;
        instance.render(content);
      }
    });

    if (instance.renderOptions.invokeGuard) {
      asyncPromise.catch((error) => {
        (instance.renderOptions.invokeGuard as invokeGuard<unknown>)(() => {
          throw new error();
        }, instance);
      });
    }

    if (instance.renderOptions.addAsyncListener) {
      instance.renderOptions.addAsyncListener(asyncPromise);
    }

    await tick();

    // if after one tick, it did not get rendered, than show pending indicator
    if (
      rendered === false &&
      currentIncrement === this.increment &&
      instance.mounted === true
    ) {
      instance.render(instance.props.pendingIndicator);
    }
  };

  /**
   * unregisters the event
   */
  public componentWillUnmount() {
    (this.instance as ComponentInstance<
      props,
      unknown,
      unknown
    >).storeProps.unsubscribe(this.update);
  }
}

export default Async;
