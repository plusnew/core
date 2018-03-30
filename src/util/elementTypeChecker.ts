import { ApplicationElement } from '../interfaces/component';
import PlusnewAbstractElement from '../PlusnewAbstractElement';
import { Fragment } from './symbols';

export class ElementTypeChecker {
  public isTextElement(abstractElement: ApplicationElement): abstractElement is string | number {
    return typeof abstractElement === 'string' || typeof abstractElement === 'number';
  }

  public isArrayElement(abstractElement: ApplicationElement): abstractElement is PlusnewAbstractElement[] {
    return Array.isArray(abstractElement);
  }

  public isFragmentElement(abstractElement: ApplicationElement): abstractElement is PlusnewAbstractElement {
    if (
      this.isPlaceholderElement(abstractElement) === false &&
      this.isArrayElement(abstractElement) === false &&
      this.isTextElement(abstractElement) === false
    ) {
      return (abstractElement as PlusnewAbstractElement).type === Fragment;
    }

    return false;
  }

  public isDomElement(abstractElement: ApplicationElement): abstractElement is PlusnewAbstractElement {
    if (
      this.isPlaceholderElement(abstractElement) === false &&
      this.isArrayElement(abstractElement) === false &&
      this.isTextElement(abstractElement) === false
    ) {
      return typeof (abstractElement as PlusnewAbstractElement).type === 'string';
    }

    return false;
  }

  public isPlaceholderElement(abstractElement: ApplicationElement): abstractElement is boolean {
    return (
      abstractElement === false || abstractElement === true || abstractElement === null || abstractElement === undefined
    );
  }

  public isComponentElement(abstractElement: ApplicationElement): abstractElement is PlusnewAbstractElement {
    if (
      this.isArrayElement(abstractElement) === false &&
      this.isTextElement(abstractElement) === false &&
      this.isPlaceholderElement(abstractElement) === false
    ) {
      return typeof (abstractElement as PlusnewAbstractElement).type === 'function';
    }

    return false;
  }
}

export default new ElementTypeChecker();
