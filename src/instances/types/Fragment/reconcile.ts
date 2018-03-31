import FragmentInstance from './Instance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import factory from '../../factory';

export default function (newAbstractElement: PlusnewAbstractElement, instance: FragmentInstance) {
  for (let i = 0; i < newAbstractElement.props.children.length; i += 1) {
    if (i < instance.rendered.length) {
      const newInstance = reconciler.update(newAbstractElement.props.children[i], instance.rendered[i]);
      if (newInstance !== instance.rendered[i]) {
        instance.rendered[i].remove();
        instance.rendered[i] = newInstance;
      }
    } else {
      instance.rendered.push(
        factory(newAbstractElement.props.children[i], instance, instance.getPreviousLength.bind(instance, i)),
      );
    }
  }

  for (let i = newAbstractElement.props.children.length; i < instance.props.children.length; i += 1) {
    instance.rendered[i].remove();
  }

  instance.props = newAbstractElement.props; // updating the shadowdom
}
