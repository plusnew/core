import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import factory from '../../factory';
import reconciler from '../../reconciler';
import ArrayInstance from './Instance';

const NOT_FOUND = -1;

function indexOf<HostElement, HostTextElement>(instance: ArrayInstance<HostElement, HostTextElement>, newAbstractElement: PlusnewAbstractElement, startIndex: number) {
  for (let i = startIndex; i < instance.rendered.length; i += 1) {
    if (reconciler.isSameAbstractElement(newAbstractElement, instance.rendered[i])) {
      return i;
    }
  }
  return NOT_FOUND;
}

export default function <HostElement, HostTextElement>(newAbstractElements: PlusnewAbstractElement[], instance: ArrayInstance<HostElement, HostTextElement>) {

  // Removal of old-elements just works if key-property is existent
  if (instance.props.children.length && instance.props.children[0] && instance.props.children[0].props && instance.props.children[0].props.key !== undefined) {
    // Checks old abstract elements, if they should get removed
    // reason for that is, that we dont want to move new elements, because of old elements which get deleted
    // moving causes animations to trigger, and that would be wrong in that case
    for (let oldIndex = 0; oldIndex < instance.props.children.length; oldIndex += 1) {
      let found = reconciler.isSameAbstractElement(newAbstractElements[oldIndex], instance.rendered[oldIndex]);
      for (let newIndex = 0; newIndex < newAbstractElements.length && found === false; newIndex += 1) {
        if (reconciler.isSameAbstractElement(newAbstractElements[newIndex], instance.rendered[oldIndex])) {
          found = true;
        }
      }

      if (found === false) {
        instance.rendered[oldIndex].remove(instance.executeChildrenElementWillUnmount);
        instance.rendered.splice(oldIndex, 1);
        instance.props.children.splice(oldIndex, 1);
        oldIndex -= 1;
      }
    }
  }

  for (let i = 0; i < newAbstractElements.length; i += 1) {
    const newAbstractElement = newAbstractElements[i];

    const getPredecessor = instance.getLastIntrinsicElementOf.bind(instance, i - 1);

    if (
      i < instance.rendered.length &&
      reconciler.isSameAbstractElement(newAbstractElement, instance.rendered[i])
    ) {
      instance.rendered[i].getPredecessor = getPredecessor;

      reconciler.update(newAbstractElement, instance.rendered[i]);
    } else {
      const oldIndex = indexOf(instance, newAbstractElement, i);
      if (oldIndex === NOT_FOUND) {
        const newInstance = factory(newAbstractElement, instance, getPredecessor, instance.renderOptions);
        instance.rendered.splice(i, 0, newInstance);
        newInstance.initialiseNestedElements();
      } else {
        const moveInstance = instance.rendered[oldIndex];
        moveInstance.getPredecessor = getPredecessor;

        // instance should move to the new position
        instance.rendered.splice(i, 0, instance.rendered[oldIndex]);
        // remove old instance
        // it needs the +1 offset, because a line before it just got inserted and the oldIndex is one after it was before
        instance.rendered.splice(oldIndex + 1, 1);

        instance.rendered[i].move(getPredecessor());

        reconciler.update(newAbstractElement, instance.rendered[i]);
      }
    }
  }

  instance.rendered.splice(
    newAbstractElements.length,
    instance.rendered.length - newAbstractElements.length,
  ).forEach(childInstance => childInstance.remove(true));

  instance.props.children = newAbstractElements;
}
