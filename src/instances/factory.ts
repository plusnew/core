import { ApplicationElement } from 'interfaces/component';
import Instance from './types/Instance';
import ArrayInstance from './types/Array/Instance';
import DomInstance from './types/Dom/Instance';
import ComponentInstance from './types/Component/Instance';
import TextInstance from './types/Text/Instance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
import elementTypeChecker from 'util/elementTypeChecker';

/**
 * because data from jsx can be anything, this factory is needed to decide what type of instance should be created
 */
export default function (abstractElement: ApplicationElement, parentInstance: Instance, previousAbstractSiblingCount: () => number): Instance {
  if (elementTypeChecker.isTextElement(abstractElement) === true) {
    return new TextInstance(abstractElement as string, parentInstance, previousAbstractSiblingCount);
  } else if (elementTypeChecker.isArrayElement(abstractElement) === true) {
    return new ArrayInstance(abstractElement as (PlusnewAbstractElement | string)[], parentInstance, previousAbstractSiblingCount);
  } else if (elementTypeChecker.isDomElement(abstractElement) === true) {
    return new DomInstance(abstractElement as PlusnewAbstractElement, parentInstance, previousAbstractSiblingCount);
  } else if (elementTypeChecker.isComponentElement(abstractElement)) {
    return new ComponentInstance(abstractElement as PlusnewAbstractElement, parentInstance, previousAbstractSiblingCount);
  } else {
    throw new Error('Factory couldn\'t create unknown element type');
  }
}
