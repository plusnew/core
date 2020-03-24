import type PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import factory from '../../factory';
import reconciler from '../../reconciler';
import type FragmentInstance from './Instance';

export default function <HostElement, HostTextElement>(newAbstractElement: PlusnewAbstractElement, instance: FragmentInstance<HostElement, HostTextElement>) {
  for (let i = 0; i < newAbstractElement.props.children.length; i += 1) {
    if (i < instance.rendered.length) {
      const newInstance = reconciler.update(newAbstractElement.props.children[i], instance.rendered[i]);
      if (newInstance !== instance.rendered[i]) {
        instance.rendered[i].remove(true);
        instance.rendered[i] = newInstance;
        instance.rendered[i].initialiseNestedElements();
      }
    } else {
      const newInstance = factory(newAbstractElement.props.children[i], instance, instance.getLastIntrinsicElementOf.bind(instance, i - 1), instance.renderOptions);
      instance.rendered.push(newInstance);
      newInstance.initialiseNestedElements();
    }
  }

  while (instance.rendered.length > newAbstractElement.props.children.length) {
    instance.rendered[newAbstractElement.props.children.length].remove(true);
    instance.rendered.splice(newAbstractElement.props.children.length, 1);
  }

  instance.props = newAbstractElement.props; // updating the shadowdom
}
