import type { ApplicationElement } from '../interfaces/component';
import type { renderOptions } from '../interfaces/renderOptions';
import type PlusnewAbstractElement from '../PlusnewAbstractElement';
import elementTypeChecker from '../util/elementTypeChecker';
import type { ComponentContainer } from './../components/factory';
import ArrayInstance from './types/Array/Instance';
import ComponentInstance from './types/Component/Instance';
import FragmentInstance from './types/Fragment/Instance';
import HostInstance from './types/Host/Instance';
import type Instance from './types/Instance';
import type { getPredeccessor } from './types/Instance';
import PlaceholderInstance from './types/Placeholder/Instance';
import ShallowInstance from './types/Shallow/Instance';
import TextInstance from './types/Text/Instance';

/**
 * because data from jsx can be anything, this factory is needed to decide what type of instance should be created
 */
export default function<HostElement, HostTextElement> (
  abstractElement: ApplicationElement,
  parentInstance: Instance<HostElement, HostTextElement>,
  getPredecessor: getPredeccessor<HostElement, HostTextElement>,
  renderOptions: renderOptions<HostElement, HostTextElement>,
): Instance<HostElement, HostTextElement> {
  // @TODO add something for invalid functions
  if (elementTypeChecker.isPlaceholderElement(abstractElement) === true) {
    return new PlaceholderInstance(abstractElement as false, parentInstance, getPredecessor, renderOptions);
  }
  if (elementTypeChecker.isTextElement(abstractElement) === true) {
    return new TextInstance(abstractElement as string, parentInstance, getPredecessor, renderOptions);
  }
  if (elementTypeChecker.isArrayElement(abstractElement) === true) {
    return new ArrayInstance(
      abstractElement as (PlusnewAbstractElement)[],
      parentInstance,
      getPredecessor,
      renderOptions,
    );
  }
  if (elementTypeChecker.isFragmentElement(abstractElement) === true) {
    return new FragmentInstance(abstractElement as PlusnewAbstractElement, parentInstance, getPredecessor, renderOptions);
  }
  if (elementTypeChecker.isDomElement(abstractElement) === true) {
    return new HostInstance(abstractElement as PlusnewAbstractElement, parentInstance, getPredecessor, renderOptions);
  }
  if (elementTypeChecker.isComponentElement(abstractElement)) {
    const componentAbstractElement = abstractElement as PlusnewAbstractElement;
    if ((componentAbstractElement.type as ComponentContainer<any, HostElement, HostTextElement>).shouldCreateComponent(parentInstance)) {
      return new ComponentInstance(
        abstractElement as PlusnewAbstractElement,
        parentInstance,
        getPredecessor,
        renderOptions,
      );
    }

    return new ShallowInstance(
      abstractElement as PlusnewAbstractElement,
      parentInstance,
      getPredecessor,
      renderOptions,
    );
  }

  throw new Error('Factory couldn\'t create unknown element type');
}
