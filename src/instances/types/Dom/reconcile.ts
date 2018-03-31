import DomInstance from './Instance';
import { props } from '../../../interfaces/component';
import reconciler from '../../reconciler';
import factory from '../../factory';

export default function (props: props, instance: DomInstance) {
  for (const propIndex in props) {
    if (propIndex === 'children') {
      for (let i = 0; i < props.children.length; i += 1) {
        if (i < instance.rendered.length) {
          const newInstance = reconciler.update(props.children[i], instance.rendered[i]);
          if (newInstance !== instance.rendered[i]) {
            instance.rendered[i].remove();
            instance.rendered[i] = newInstance;
          }
        } else {
          instance.rendered.push(
            factory(props.children[i], instance, instance.getPreviousLength.bind(instance, i)),
          );
        }
      }
    } else {
      if (instance.props[propIndex] !== props[propIndex]) {
        instance.setProp(propIndex, props[propIndex]);
      }
    }
  }

  for (let i = props.children.length; i < instance.props.children.length; i += 1) {
    instance.rendered[i].remove();
  }

  Object.keys(instance.props).forEach((index) => {
    if (index in props === false) {
      instance.unsetProp(index);
    }
  });

  instance.props = props; // updating the shadowdom
}
