import { ApplicationElement } from 'interfaces/component';
import Instance from './Instance';
import ArrayInstance from './ArrayInstance';
import DomInstance from './DomInstance';
import ComponentInstance from './ComponentInstance';
import TextInstance from './TextInstance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

/**
 * because data from jsx can be anything, this factory is needed to decide what type of instance should be created
 */
export default function (abstractElement: ApplicationElement, parentInstance: Instance, previousAbstractSiblingCount: () => number): Instance {
  if (typeof(abstractElement) === 'string') {
    debugger;
    return new TextInstance(abstractElement, parentInstance, previousAbstractSiblingCount);
  } else if (Array.isArray(abstractElement) === true) {
    return new ArrayInstance(abstractElement as (PlusnewAbstractElement | string)[], parentInstance, previousAbstractSiblingCount);
  } else {
    if (typeof((abstractElement as PlusnewAbstractElement).type) === 'string') {
      return new DomInstance(abstractElement as PlusnewAbstractElement, parentInstance, previousAbstractSiblingCount);
    } else {
      return new ComponentInstance(abstractElement, parentInstance, previousAbstractSiblingCount);
    }
  }
}
