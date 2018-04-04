import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

function isEqual(a: {[key: string]: any}, b: {[key: string]: any}) {
  const keys = Object.keys(a);
  if (keys.length === Object.keys(b).length) {
    return keys.reduce((result, currentKey) => {
      // @TODO check for *children* should be different
      if (currentKey in b === false || a[currentKey] !== b[currentKey]) {
        return false;
      }
      return result;
    }, true);
  }
  return false;
}

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
