import { ApplicationElement } from '../interfaces/component';
import Instance, { getPredeccessor } from './types/Instance';
import ArrayInstance from './types/Array/Instance';
import PlaceHolderInstance from './types/Placeholder/Instance';
import DomInstance from './types/Dom/Instance';
import FragmentInstance from './types/Fragment/Instance';
import ComponentInstance from './types/Component/Instance';
import ShallowInstance from './types/Shallow/Instance';
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
  getPredecessor: getPredeccessor,
): Instance {
  // @TODO add something for invalid functions
  if (elementTypeChecker.isPlaceholderElement(abstractElement) === true) {
    return new PlaceHolderInstance(abstractElement as false, parentInstance, getPredecessor);
  }
  if (elementTypeChecker.isTextElement(abstractElement) === true) {
    return new TextInstance(abstractElement as string, parentInstance, getPredecessor);
  }
  if (elementTypeChecker.isArrayElement(abstractElement) === true) {
    return new ArrayInstance(
      abstractElement as (PlusnewAbstractElement)[],
      parentInstance,
      getPredecessor,
    );
  }
  if (elementTypeChecker.isFragmentElement(abstractElement) === true) {
    return new FragmentInstance(abstractElement as PlusnewAbstractElement, parentInstance, getPredecessor);
  }
  if (elementTypeChecker.isDomElement(abstractElement) === true) {
    return new DomInstance(abstractElement as PlusnewAbstractElement, parentInstance, getPredecessor);
  }
  if (elementTypeChecker.isComponentElement(abstractElement)) {
    if (parentInstance.createChildrenComponents === false && parentInstance.nodeType !== types.Root) {
      return new ShallowInstance(
        abstractElement as PlusnewAbstractElement,
        parentInstance,
        getPredecessor,
      );
    }

    return new ComponentInstance(
      abstractElement as PlusnewAbstractElement,
      parentInstance,
      getPredecessor,
    );
  }

  throw new Error('Factory couldn\'t create unknown element type');
}
