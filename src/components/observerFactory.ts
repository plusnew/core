import type ComponentInstance from '../instances/types/Component/Instance';
import type { ApplicationElement } from '../interfaces/component';
import type { Store } from '../util/store';
import AbstractClass from './AbstractClass';

type renderFunction<state> = (state: state) => ApplicationElement;

export type observerProps<state> = {
  children: renderFunction<state>;
};

export default function <state>(store: Store<state, any>) {

  return class Observer extends AbstractClass<observerProps<state>> {
    instance?: ComponentInstance<observerProps<state>, unknown, unknown>;

    public render(_props: any, instance: ComponentInstance<observerProps<state>, unknown, unknown>) {
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
      const instance = this.instance as ComponentInstance<observerProps<state>, unknown, unknown>;
      const renderFunction = ((instance.props.children as any)[0] as renderFunction<state>);
      if (instance.renderOptions.invokeGuard === undefined) {
        instance.render(
          renderFunction(store.getState()),
        );
      } else {

        instance.renderOptions.invokeGuard(() => {
          const result = renderFunction(store.getState());
          instance.render(result);
        });
      }
    }

    /**
     * unregisters the event
     */
    public componentWillUnmount() {
      store.unsubscribe(this.update);
      // @FIXME this cast should be removed and typechecked
      (this.instance as ComponentInstance<observerProps<state>, unknown, unknown>).storeProps.unsubscribe(this.update);
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
