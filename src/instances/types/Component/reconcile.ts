import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

/**
 * checks if a component is the same as before
 */
function isEqual(a: {[key: string]: any}, b: {[key: string]: any}): boolean {
  let isSame = true;

  const keys = Object.keys(a);
  if (keys.length === Object.keys(b).length) {
    for (let keyIndex = 0; keyIndex < keys.length && isSame === true; keyIndex += 1) {
      const currentKey = keys[keyIndex];
      if (currentKey === 'children') {
        if (a.children.length === b.children.length) {
          for (let childrenIndex = 0; childrenIndex < a.children.length; childrenIndex += 1)
            if (typeof a.children[childrenIndex] === 'object' &&
                typeof b.children[childrenIndex] === 'object' &&
                a.children[childrenIndex] !== null &&
                b.children[childrenIndex] !== null) {
              if (a.children[childrenIndex].type === b.children[childrenIndex].type) {
                isSame = isEqual(a.children[childrenIndex].props, b.children[childrenIndex].props);
              } else {
                isSame = false;
              }
            } else {
              isSame = a.children[childrenIndex] === b.children[childrenIndex];
            }
        } else {
          isSame = false;
        }
      } else if (currentKey in b === false || a[currentKey] !== b[currentKey]) {
        isSame = false;
      }
    }
  } else {
    isSame = false;
  }
  return isSame;
}

/**
 * checks if a component needs updates, if the props are the same it does not need an update
 */
function shouldUpdate(newAbstractElement: PlusnewAbstractElement, instance: ComponentInstance) {
  return isEqual(newAbstractElement.props, instance.abstractElement.props) === false;
}

export default function (newAbstractElement: PlusnewAbstractElement, instance: ComponentInstance) {
  const newAbstractChildren = instance.render(newAbstractElement.props, instance.dependencies);

  const newChildrenInstance = reconciler.update(newAbstractChildren, instance.children);
  if (newChildrenInstance !== instance.children) {
    instance.children.remove();
    instance.children = newChildrenInstance;
  }

  instance.abstractElement = newAbstractElement;
}

export { shouldUpdate };
