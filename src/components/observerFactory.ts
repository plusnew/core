import { storeType } from '../util/store';
import AbstractClass from './AbstractClass';
import ComponentInstance from 'instances/types/Component/Instance';
import { ApplicationElement } from 'interfaces/component';

export type observerProps<state> = {
  render: (state: state) => ApplicationElement;
};

export default function <state>(store: storeType<state, any>) {

  return class Observer extends AbstractClass<observerProps<state>> {
    render(_props: any, instance: ComponentInstance<observerProps<state>>) {
      store.addOnChange((state) => {
        instance.render(
          instance.props.state.render(store.state),
        );
      });

      return instance.props.state.render(store.state);
    }
  };
}
