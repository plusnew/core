import { storeType } from '../util/store';
import AbstractClass from './AbstractClass';
import ComponentInstance from 'instances/types/Component/Instance';
import { ApplicationElement } from 'interfaces/component';

export type consumerProps<state> = {
  render: (state: state) => ApplicationElement;
};

export default function <state>(store: storeType<state, any>) {

  return class Consumer extends AbstractClass<consumerProps<state>> {
    render(_props: any, instance: ComponentInstance<consumerProps<state>>) {
      store.addOnChange((state) => {
        instance.render(
          instance.props.state.render(store.state),
        );
      });

      return instance.props.state.render(store.state);
    }
  };
}
