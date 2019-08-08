import { props } from '../../../interfaces/component';
import factory from '../../factory';
import reconciler from '../../reconciler';
import DomInstance from './Instance';

export default function <HostElement, HostTextElement>(props: props, instance: DomInstance<HostElement, HostTextElement>) {
  for (const propIndex in props) {
    if (propIndex === 'children') {
      for (let i = 0; i < props.children.length; i += 1) {
        if (i < instance.rendered.length) {
          const newInstance = reconciler.update(props.children[i], instance.rendered[i]);
          if (newInstance !== instance.rendered[i]) {
            instance.rendered[i].remove(true);
            instance.rendered[i] = newInstance;
            instance.rendered[i].initialiseNestedElements();
          }
        } else {
          const newInstance = factory(props.children[i], instance, instance.getLastIntrinsicElementOf.bind(instance, i - 1), instance.renderOptions);
          instance.rendered.push(newInstance);
          newInstance.initialiseNestedElements();
        }
      }
    } else {
      if (instance.props[propIndex] !== props[propIndex]) {
        instance.setProp(propIndex, props[propIndex]);
      }
    }
  }

  while (instance.rendered.length > props.children.length) {
    instance.rendered[props.children.length].remove(true);
    instance.rendered.splice(props.children.length, 1);
  }

  Object.keys(instance.props).forEach((index) => {
    if (index in props === false) {
      instance.unsetProp(index);
    }
  });

  instance.props = props; // updating the shadowdom
}
