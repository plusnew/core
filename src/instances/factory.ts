import { ApplicationElement } from '../interfaces/component';
import Instance from './types/Instance';
import ArrayInstance from './types/Array/Instance';
import PlaceHolderInstance from './types/Placeholder/Instance';
import DomInstance from './types/Dom/Instance';
import FragmentInstance from './types/Fragment/Instance';
import ComponentInstance from './types/Component/Instance';
import TextInstance from './types/Text/Instance';
import PlusnewAbstractElement from '../PlusnewAbstractElement';
import elementTypeChecker from '../util/elementTypeChecker';
import types from './types/types';

/**
 * because data from jsx can be anything, this factory is needed to decide what type of instance should be created
 */
export default function (
  abstractElement: ApplicationElement,
  parentInstance: Instance,
  previousAbstractSiblingCount: () => number,
): Instance {
  // @TODO add something for invalid functions
  if (elementTypeChecker.isPlaceholderElement(abstractElement) === true) {
    return new PlaceHolderInstance(abstractElement as false, parentInstance, previousAbstractSiblingCount);
  }
  if (elementTypeChecker.isTextElement(abstractElement) === true) {
    return new TextInstance(abstractElement as string, parentInstance, previousAbstractSiblingCount);
  }
  if (elementTypeChecker.isArrayElement(abstractElement) === true) {
    return new ArrayInstance(
      abstractElement as (PlusnewAbstractElement)[],
      parentInstance,
      previousAbstractSiblingCount,
    );
  }
  if (elementTypeChecker.isFragmentElement(abstractElement) === true) {
    return new FragmentInstance(abstractElement as PlusnewAbstractElement, parentInstance, previousAbstractSiblingCount);
  }
  if (elementTypeChecker.isDomElement(abstractElement) === true) {
    return new DomInstance(abstractElement as PlusnewAbstractElement, parentInstance, previousAbstractSiblingCount);
  }
  if (elementTypeChecker.isComponentElement(abstractElement)) {
    if (parentInstance.createChildrenComponents === false && parentInstance.nodeType !== types.Root) {
      return new PlaceHolderInstance(false, parentInstance, previousAbstractSiblingCount);
    }

    return new ComponentInstance(
      abstractElement as PlusnewAbstractElement,
      parentInstance,
      previousAbstractSiblingCount,
    );
  }

  throw new Error('Factory couldn\'t create unknown element type');
}
