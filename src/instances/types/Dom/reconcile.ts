import DomInstance from './Instance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import factory from '../../factory';

export default function (newAbstractElement: PlusnewAbstractElement, instance: DomInstance) {
  for (const propIndex in newAbstractElement.props) {
    if (propIndex === 'children') {
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
    } else {
      if (instance.props.props[propIndex] !== newAbstractElement.props[propIndex]) {
        instance.setProp(propIndex, newAbstractElement.props[propIndex]);
      }
    }
  }

  for (let i = newAbstractElement.props.children.length; i < instance.props.props.children.length; i += 1) {
    instance.rendered[i].remove();
  }

  Object.keys(instance.props.props).forEach((index) => {
    if (index in newAbstractElement.props === false) {
      instance.unsetProp(index);
    }
  });

  instance.props = newAbstractElement; // updating the shadowdom
}
