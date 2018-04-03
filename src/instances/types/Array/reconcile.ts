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

  // Removal of old-elements just works if key-property is existent
  if (instance.abstractElement.length && instance.abstractElement[0].props && instance.abstractElement[0].props.key !== undefined) {
    // Checks old abstract elements, if they should get removed
    // reason for that is, that we dont want to move new elements, because of old elements which get deleted
    // moving causes animations to trigger, and that would be wrong in that case
    for (let oldIndex = 0; oldIndex < instance.abstractElement.length; oldIndex += 1) {
      let found = reconciler.isSameAbstractElement(instance.children[oldIndex].abstractElement, newAbstractElements[oldIndex]);
      for (let newIndex = 0; newIndex < newAbstractElements.length && found === false; newIndex += 1) {
        if (reconciler.isSameAbstractElement(instance.children[oldIndex].abstractElement, newAbstractElements[newIndex])) {
          found = true;
        }
      }

      if (!found) {
        instance.children[oldIndex].remove();
        instance.children.splice(oldIndex, 1);
        instance.abstractElement.splice(oldIndex, 1);
        oldIndex -= 1;
      }
    }
  }

  for (let i = 0; i < newAbstractElements.length; i += 1) {
    const newAbstractElement = newAbstractElements[i];
    const previousLength = instance.getPreviousLength.bind(instance, i);

    if (
      i < instance.children.length &&
      reconciler.isSameAbstractElement(newAbstractElement, instance.children[i].abstractElement)
    ) {
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

        instance.children[i].move(previousLength());
        reconciler.update(newAbstractElement, instance.children[i]);
      }
    }
  }

  instance.children.splice(
    newAbstractElements.length,
    instance.abstractElement.length - newAbstractElements.length,
  ).forEach(childInstance => childInstance.remove());

  instance.abstractElement = newAbstractElements;
}
