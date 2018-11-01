import { Props } from '../index';
import ComponentInstance from '../instances/types/Component/Instance';
import AbstractClass from './AbstractClass';
import { ApplicationElement } from '../interfaces/component';

type promiseGenerator = () => Promise<ApplicationElement>;
type props = {
  children: promiseGenerator;
  pendingIndicator: ApplicationElement;
};

class Async extends AbstractClass<props> {
  instance: ComponentInstance<props>;
  render(_Props: Props<props>, instance: ComponentInstance<props>) {
    this.instance = instance;
    this.instance.storeProps.subscribe(this.update);

    this.update();
    return this.instance.props.pendingIndicator;
  }

  private update = () => {
    ((this.instance.props.children as any)[0] as promiseGenerator)().then((content) => {
      this.instance.render(content);
    });

    this.instance.render(this.instance.props.pendingIndicator);
  }

  /**
   * unregisters the event
   */
  public componentWillUnmount() {
    this.instance.storeProps.unsubscribe(this.update);
  }

}

export default Async;
