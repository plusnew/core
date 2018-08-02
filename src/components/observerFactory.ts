import { storeType } from '../util/store';
import AbstractClass from './AbstractClass';
import ComponentInstance from '../instances/types/Component/Instance';
import { ApplicationElement } from '../interfaces/component';

export type observerProps<state> = {
  render: (state: state) => ApplicationElement;
};

export default function <state>(store: storeType<state, any>) {

  return class Observer extends AbstractClass<observerProps<state>> {
    instance: ComponentInstance<observerProps<state>>;

    public render(_props: any, instance: ComponentInstance<observerProps<state>>) {
      this.instance = instance;

      store.addOnChange(this.update);

      return instance.props.render(store.getState());
    }

    /**
     * has to be a property on the componentinstance, to create new reference each time
     * so that removal of correct listener is possible
     */
    private update = (state: state) => {
      this.instance.render(
        this.instance.props.render(store.getState()),
      );
    }

    public componentWillUnmount() {
      store.removeOnChange(this.update);
    }

    static shouldCreateComponent() {
      return true;
    }
  };
}
