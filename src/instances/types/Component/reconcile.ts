import { ApplicationElement, props } from '../../../interfaces/component';
import { TypeOfPlusnew } from '../../../util/symbols';
import reconciler from '../../reconciler';
import ComponentInstance from './Instance';

function isPlusnewElement(a: any) {
  return typeof a === 'object' && a !== null && a.$$typeof === TypeOfPlusnew;
}

/**
 * checks if a component is the same as before
 */
function isPropsEqual(a: {[key: string]: any}, b: {[key: string]: any}): boolean {
  let isSame = true;
  const keys = Object.keys(a);
  if (keys.length === Object.keys(b).length) {
    for (let i = 0; i < keys.length && isSame === true; i += 1) {
      const currentKey = keys[i];
      isSame = currentKey in b && isSameElement(a[currentKey], b[currentKey]);
    }
  } else {
    isSame = false;
  }

  return isSame;
}

function isSameElement(a: any, b: any): boolean {
  let isSame = true;
  if (isPlusnewElement(a) && isPlusnewElement(b) && a.type === b.type) {
    isSame = isPropsEqual(a.props, b.props);
  } else if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) { // if it is an array, it should have the same length to be the same - also o
    if (isPlusnewElement(a[0]) || (typeof a[0] !== 'object' || a[0] === null)) {
      for (let i = 0; i < a.length && isSame === true; i += 1) {
        isSame = isSameElement(a[i], b[i]);
      }
    } else {
      isSame = Object.is(a, b);
    }
  } else {
    // in case it has no special condition, do a equality check
    // Object.is is used, for better comparison of +0 and -1 and also NaN
    isSame = Object.is(a, b);
  }

  return isSame;
}

/**
 * checks if a component needs updates, if the props are the same it does not need an update
 */
export function shouldUpdate(props: Partial<props>, instance: ComponentInstance<any>) {
  return isPropsEqual(props, instance.props) === false;
}

export default (newAbstractChildren: ApplicationElement, instance: ComponentInstance<any>) => {
  const newChildrenInstance = reconciler.update(newAbstractChildren, instance.rendered);
  if (newChildrenInstance !== instance.rendered) {
    instance.rendered.remove(true);
    instance.rendered = newChildrenInstance;
  }
};
