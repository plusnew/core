import reconciler from '../../reconciler';
import { ApplicationElement } from '../../../interfaces/component';
import ComponentInstance from './Instance';

export default (newAbstractChildren: ApplicationElement, instance: ComponentInstance<any>) => {
  const newChildrenInstance = reconciler.update(newAbstractChildren, instance.rendered);
  if (newChildrenInstance !== instance.rendered) {
    instance.rendered.remove(true);
    instance.rendered = newChildrenInstance;
  }
};
