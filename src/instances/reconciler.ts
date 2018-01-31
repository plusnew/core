import PlusnewAbstractElement from '../PlusnewAbstractElement';
import { ApplicationElement } from '../interfaces/component';

import factory from './factory';
import Instance from './types/Instance';
import types from './types/types';
import elementTypeChecker from '../util/elementTypeChecker';

import DomInstance from './types/Dom/Instance';
import domReconcile from './types/Dom/reconcile';

import TextInstance from './types/Text/Instance';
import textReconcile from './types/Text/reconcile';

import ComponentInstance from './types/Component/Instance';
import componentReconcile from './types/Component/reconcile';

import ArrayInstance from './types/Array/Instance';
import arrayReconcile from './types/Array/reconcile';

export class Reconciler {
  /**
   * Checks if something changed
   * evaluates if its the same instance, and if it needs an update
   * or if it should be removed and replaced
   */
  public update(newAbstractElement: ApplicationElement, instance: Instance): Instance {
    if (this.isSameAbstractElement(newAbstractElement, instance.abstractElement)) {
      if (instance.type === types.Placeholder) {
        // When its a placeholder, there is no need for updating, nothing will change there
        // it will get replaced, but that's it
      } else if (instance.type === types.Dom) {
        domReconcile(newAbstractElement as PlusnewAbstractElement, instance as DomInstance);
      } else if (instance.type === types.Text) {
        textReconcile(newAbstractElement as 'string', instance as TextInstance);
      } else if (instance.type === types.Array) {
        arrayReconcile(newAbstractElement as PlusnewAbstractElement[], instance as ArrayInstance);
      } else if (instance.type === types.Component) {
        componentReconcile(newAbstractElement as PlusnewAbstractElement, instance as ComponentInstance);
      } else {
        throw new Error('Updating this element is not yet implemented');
      }
      return instance;
    }

    return factory(newAbstractElement, instance.parentInstance as Instance, instance.previousAbstractSiblingCount);
  }

  /**
   * checks if the abstractElements are the same
   */
  public isSameAbstractElement(newAbstractElement: ApplicationElement, oldAbstractElement: ApplicationElement) {
    // The following code does the key-property check, not yet stable
    if (this.isSameAbstractElementType(newAbstractElement, oldAbstractElement) === true) {
      if (elementTypeChecker.isComponentElement(newAbstractElement) === true || elementTypeChecker.isDomElement(newAbstractElement)) {
        if ((newAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
          if ((oldAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
            // newAbstractElement and oldAbstractElement, have a key - is it the same?
            return (newAbstractElement as PlusnewAbstractElement).props.key === (oldAbstractElement as PlusnewAbstractElement).props.key;
          }
          // newAbstractElement has key, but oldAbstractElement has not
          return false;
        }
        if ((oldAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
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
  private isSameAbstractElementType(newAbstractElement: ApplicationElement, oldAbtractElement: ApplicationElement) {
    if (elementTypeChecker.isPlaceholderElement(newAbstractElement)) {
      return elementTypeChecker.isPlaceholderElement(oldAbtractElement);
    }

    if (elementTypeChecker.isTextElement(newAbstractElement)) {
      return elementTypeChecker.isTextElement(oldAbtractElement);
    }

    if (elementTypeChecker.isArrayElement(newAbstractElement)) {
      return elementTypeChecker.isArrayElement(oldAbtractElement);
    }

    if (elementTypeChecker.isDomElement(newAbstractElement)) {
      if (elementTypeChecker.isDomElement(oldAbtractElement)) {
        // newAbstractElement and oldAbtractElement are dom elements, but is elementNode the same
        return (newAbstractElement as PlusnewAbstractElement).type === (oldAbtractElement as PlusnewAbstractElement).type;
      }

      // newAbstractElement is a domElement, but oldAbtractElement isn't
      return false;
    }

    if (elementTypeChecker.isComponentElement(newAbstractElement)) {
      if (elementTypeChecker.isComponentElement(oldAbtractElement)) {
        // newAbstractElement and oldAbtractElement are components, but are they the same function
        return (newAbstractElement as PlusnewAbstractElement).type === (oldAbtractElement as PlusnewAbstractElement).type;
      }

      // newAbstractElement is a component, but oldAbtractElement isn't
      return false;
    }

    throw new Error('Unknown abstractElement detected');
  }
}

export default new Reconciler();
