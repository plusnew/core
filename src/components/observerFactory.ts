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

    public render(props: any, instance: ComponentInstance<observerProps<state>>) {
      this.instance = instance;

      store.addOnChange(this.update);
      props.getStore().addOnChange(this.update);

      return instance.props.render(store.getCurrentState());
    }

    /**
     * has to be a property on the componentinstance, to create new reference each time
     * so that removal of correct listener is possible
     */
    private update = () => {
      this.instance.render(
        this.instance.props.render(store.getCurrentState()),
      );
    }

    /**
     * unregisters the event
     */
    public componentWillUnmount() {
      store.removeOnChange(this.update);
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
    static getCurrentState() {
      return store.getCurrentState();
    }

    /**
     * gives the corresponding store to this observer
     */
    static getStore() {
      return store;
    }
  };
}
