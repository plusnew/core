import { Props } from '../index';
import ComponentInstance from '../instances/types/Component/Instance';
import AbstractClass from './AbstractClass';
import { ApplicationElement } from '../interfaces/component';

function tick() {
  return Promise.resolve();
}

type promiseGenerator = () => Promise<ApplicationElement>;
type props = {
  children: promiseGenerator;
  pendingIndicator: ApplicationElement;
};

class Async extends AbstractClass<props> {
  instance: ComponentInstance<props>;

  private increment = 0;

  render(_Props: Props<props>, instance: ComponentInstance<props>) {
    this.instance = instance;
    this.instance.storeProps.subscribe(this.update);

    this.update();
    return this.instance.props.pendingIndicator;
  }

  private update = async () => {
    this.increment += 1;
    const currentIncrement = this.increment;

    let rendered = false;

    ((this.instance.props.children as any)[0] as promiseGenerator)().then((content) => {
      if (currentIncrement === this.increment) {
        rendered = true;
        this.instance.render(content);
      }
    });

    await tick();

    if (rendered === false && currentIncrement === this.increment) {
      this.instance.render(this.instance.props.pendingIndicator);
    }
  }

  /**
   * unregisters the event
   */
  public componentWillUnmount() {
    this.instance.storeProps.unsubscribe(this.update);
  }

}

export default Async;
