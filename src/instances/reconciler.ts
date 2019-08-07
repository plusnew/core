import { ApplicationElement } from '../interfaces/component';
import PlusnewAbstractElement from '../PlusnewAbstractElement';
import elementTypeChecker from '../util/elementTypeChecker';
import factory from './factory';
import Instance from './types/Instance';
import types from './types/types';
import ComponentInstance from './types/Component/Instance';

export class Reconciler {
  /**
   * Checks if something changed
   * evaluates if its the same instance, and if it needs an update
   * or if it should be removed and replaced
   */
  public update<HostElement, HostTextElement>(newAbstractElement: ApplicationElement, instance: Instance<HostElement, HostTextElement>): Instance<HostElement, HostTextElement> {
    if (this.isSameAbstractElement(newAbstractElement, instance)) {
      instance.reconcile(newAbstractElement);
      return instance;
    }

    const newInstance = factory(
      newAbstractElement,
      instance.parentInstance as Instance<HostElement, HostTextElement>,
      instance.getPredecessor,
      (instance.parentInstance as Instance<HostElement, HostTextElement>).renderOptions);

    return newInstance;
  }

  /**
   * checks if the abstractElements are the same
   */
  public isSameAbstractElement<HostElement, HostTextElement>(newAbstractElement: ApplicationElement, instance: Instance<HostElement, HostTextElement>) {
    // The following code does the key-property check, not yet stable
    if (this.isSameAbstractElementType(newAbstractElement, instance) === true) {
      if (elementTypeChecker.isComponentElement(newAbstractElement) === true || elementTypeChecker.isDomElement(newAbstractElement) === true) {
        if ((newAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
          if ((instance as ComponentInstance<any, HostElement, HostTextElement>).props.hasOwnProperty('key')) {
            // newAbstractElement and oldAbstractElement, have a key - is it the same?
            return (
              (newAbstractElement as PlusnewAbstractElement).props.key ===
              (instance as ComponentInstance<any, HostElement, HostTextElement>).props.key
            );
          }
          // newAbstractElement has key, but oldAbstractElement has not
          return false;
        }
        if ((instance as ComponentInstance<any, HostElement, HostTextElement>).props.hasOwnProperty('key')) {
          // newAbstractElement has no key, but oldAbstractElement has
          return false;
        }
        // newAbstractElement and oldAbstractElement dont have a key, because of that its assumed they are the same
        return true;
      }

      // newAbstractElement and oldAbstractElement, are either text or array. these are handled the same
      return true;
    }
    // it's not the same type, therefore it can't be the same element
    return false;
  }

  /**
   * checks if the abstractElements are the same type
   */
  private isSameAbstractElementType(newAbstractElement: ApplicationElement, instance: Instance<HostElement, HostTextElement>) {
    if (elementTypeChecker.isPlaceholderElement(newAbstractElement)) {
      return instance.nodeType === types.Placeholder;
    }

    if (elementTypeChecker.isTextElement(newAbstractElement)) {
      return instance.nodeType === types.Text;
    }

    if (elementTypeChecker.isArrayElement(newAbstractElement)) {
      return instance.nodeType === types.Array;
    }

    if (elementTypeChecker.isFragmentElement(newAbstractElement)) {
      return instance.nodeType === types.Fragment;
    }

    if (elementTypeChecker.isDomElement(newAbstractElement)) {
      if (instance.nodeType === types.Dom) {
        // newAbstractElement and oldAbtractElement are dom elements, but is elementNode the same
        return (
          (newAbstractElement as PlusnewAbstractElement).type === instance.type
        );
      }

      // newAbstractElement is a domElement, but oldAbtractElement isn't
      return false;
    }

    if (elementTypeChecker.isComponentElement(newAbstractElement)) {
      if (instance.nodeType === types.Component) {
        // newAbstractElement and oldAbtractElement are components, but are they the same function
        return (
          (newAbstractElement as PlusnewAbstractElement).type === instance.type
        );
      }

      // newAbstractElement is a component, but oldAbtractElement isn't
      return false;
    }

    throw new Error('Unknown abstractElement detected');
  }
}

export default new Reconciler();
