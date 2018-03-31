import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import factory from '../../factory';
import ArrayInstance from './Instance';

const NOT_FOUND = -1;

function indexOf(instance: ArrayInstance, newAbstractElement: PlusnewAbstractElement, startIndex: number) {
  for (let i = startIndex; i < instance.rendered.length; i += 1) {
    if (reconciler.isSameAbstractElement(instance.rendered[i].props, newAbstractElement)) {
      return i;
    }
  }
  return NOT_FOUND;
}

export default function (newAbstractElements: PlusnewAbstractElement[], instance: ArrayInstance) {

  // Checks old abstract elements, if they should get removed
  // reason for that is, that we dont want to move new elements, because of old elements which get deleted
  // moving causes animations to trigger, and that would be wrong in that case
  for (let oldIndex = 0; oldIndex < instance.props.length; oldIndex += 1) {
    let found = reconciler.isSameAbstractElement(instance.rendered[oldIndex].props, newAbstractElements[oldIndex]);
    for (let newIndex = 0; newIndex < newAbstractElements.length && found === false; newIndex += 1) {
      if (reconciler.isSameAbstractElement(instance.rendered[oldIndex].props, newAbstractElements[newIndex])) {
        found = true;
      }
    }

    if (!found) {
      instance.rendered[oldIndex].remove();
      instance.rendered.splice(oldIndex, 1);
      instance.props.splice(oldIndex, 1);
      oldIndex -= 1;
    }
  }

  for (let i = 0; i < newAbstractElements.length; i += 1) {
    const newAbstractElement = newAbstractElements[i];
    const previousLength = instance.getPreviousLength.bind(instance, i);

    if (
      i < instance.rendered.length &&
      reconciler.isSameAbstractElement(newAbstractElement, instance.rendered[i].props)
    ) {
      instance.rendered[i].previousAbstractSiblingCount = previousLength;
      reconciler.update(newAbstractElement, instance.rendered[i]);
    } else {
      const oldIndex = indexOf(instance, newAbstractElement, i);
      if (oldIndex === NOT_FOUND) {
        instance.rendered.splice(i, 0, factory(newAbstractElement, instance, previousLength));
      } else {
        instance.rendered[oldIndex].previousAbstractSiblingCount = previousLength;
        // instance should move to the new position
        instance.rendered.splice(i, 0, instance.rendered[oldIndex]);

        // remove old instance
        // it needs the +1 offset, because a line before it just got inserted and the oldIndex is one after it was before
        instance.rendered.splice(oldIndex + 1, 1);

        instance.rendered[i].move(previousLength());
        reconciler.update(newAbstractElement, instance.rendered[i]);
      }
    }
  }

  instance.props = newAbstractElements;
}
