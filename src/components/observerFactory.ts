import { storeType } from '../util/store';
import AbstractClass from './AbstractClass';
import ComponentInstance from '../instances/types/Component/Instance';
import { ApplicationElement } from '../interfaces/component';

type renderFunction<state> = (state: state) => ApplicationElement;

export type observerProps<state> = {
  children: renderFunction<state>;
};

export default function <state>(store: storeType<state, any>) {

  return class Observer extends AbstractClass<observerProps<state>> {
    instance: ComponentInstance<observerProps<state>>;

    public render(_props: any, instance: ComponentInstance<observerProps<state>>) {
      this.instance = instance;

      store.subscribe(this.update);
      instance.storeProps.subscribe(this.update);

      return ((instance.props.children as any)[0] as renderFunction<state>)(store.getState());
    }

    /**
     * has to be a property on the componentinstance, to create new reference each time
     * so that removal of correct listener is possible
     */
    private update = () => {
      const renderFunction = ((this.instance.props.children as any)[0] as renderFunction<state>);
      if (this.instance.invokeGuard === null) {
        this.instance.render(
          renderFunction(store.getState()),
        );
      } else {
        const invokeHandle = this.instance.invokeGuard(() => renderFunction(store.getState()));
        if (invokeHandle.hasError === false) {
          this.instance.render(invokeHandle.result);
        }
      }
    }

    /**
     * unregisters the event
     */
    public componentWillUnmount() {
      store.unsubscribe(this.update);
      this.instance.storeProps.unsubscribe(this.update);
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
    static getState() {
      return store.getState();
    }

  };
}
