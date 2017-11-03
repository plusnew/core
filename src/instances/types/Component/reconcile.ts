import PlusnewAbstractElement from 'PlusnewAbstractElement';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

export default function (newAbstractElement: PlusnewAbstractElement, instance: ComponentInstance) {  
  const newAbstractChildren = instance.renderFunction(newAbstractElement.props);
  const newChildrenInstance = reconciler.update(newAbstractChildren, instance.children);
  if (newChildrenInstance !== instance.children) {
    instance.children.remove();
    instance.children = newChildrenInstance;
  }
}
