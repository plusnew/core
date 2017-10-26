import { ApplicationElement } from 'interfaces/component';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

export default function (newAbstractElement: ApplicationElement, instance: ComponentInstance) {  
  const newInstance = reconciler.update(newAbstractElement, instance.children);
  if (newInstance !== instance.children) {
    instance.children.remove();
    instance.children = newInstance;
  }
}
