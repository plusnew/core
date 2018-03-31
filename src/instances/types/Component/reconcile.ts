import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

export default function (newAbstractElement: PlusnewAbstractElement, instance: ComponentInstance) {
  const newAbstractChildren = instance.render(newAbstractElement.props, instance.dependencies);

  const newChildrenInstance = reconciler.update(newAbstractChildren, instance.rendered);
  if (newChildrenInstance !== instance.rendered) {
    instance.rendered.remove();
    instance.rendered = newChildrenInstance;
  }

  instance.props = newAbstractElement;
}
