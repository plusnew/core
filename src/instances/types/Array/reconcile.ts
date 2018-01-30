import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import factory from '../../factory';
import ArrayInstance from './Instance';

const NOT_FOUND = -1;

function indexOf(instance: ArrayInstance, newAbstractElement: PlusnewAbstractElement, startIndex: number) {
  for (let i = startIndex; i < instance.children.length; i += 1) {
    if (reconciler.isSameAbstractElement(instance.children[i].abstractElement, newAbstractElement)) {
      return i;
    }
  }
  return NOT_FOUND;
}

export default function (newAbstractElements: PlusnewAbstractElement[], instance: ArrayInstance) {
  for (let i = 0; i < newAbstractElements.length; i += 1) {
    const newAbstractElement = newAbstractElements[i];
    const previousLength = instance.getPreviousLength.bind(instance, i);

    if (i < instance.children.length && reconciler.isSameAbstractElement(newAbstractElement, instance.children[i].abstractElement)) {
      instance.children[i].previousAbstractSiblingCount = previousLength;
      reconciler.update(newAbstractElement, instance.children[i]);
    } else {
      const oldIndex = indexOf(instance, newAbstractElement, i);
      if (oldIndex === NOT_FOUND) {
        instance.children.splice(i, 0, factory(newAbstractElement, instance, previousLength));
      } else {
        instance.children[oldIndex].previousAbstractSiblingCount = previousLength;
        // instance should move to the new position
        instance.children.splice(i, 0, instance.children[oldIndex]);

        // remove old instance
        // it needs the +1 offset, because a line before it just got inserted and the oldIndex is one after it was before
        instance.children.splice(oldIndex + 1, 1);

        instance.children[i].move(i);
        reconciler.update(newAbstractElement, instance.children[i]);
      }
    }
  }

  instance.children.splice(newAbstractElements.length, instance.children.length).forEach((childInstance) => {
    childInstance.remove();
  });
}
