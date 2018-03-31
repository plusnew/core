import { props } from '../../../interfaces/component';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

export default function (props: props, instance: ComponentInstance) {
  const newAbstractChildren = instance.render(props, instance.dependencies);

  const newChildrenInstance = reconciler.update(newAbstractChildren, instance.rendered);
  if (newChildrenInstance !== instance.rendered) {
    instance.rendered.remove();
    instance.rendered = newChildrenInstance;
  }

  instance.props = props;
}
