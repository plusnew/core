import { ApplicationElement } from '../interfaces/component';
import PlusnewAbstractElement from '../PlusnewAbstractElement';

export class ElementTypeChecker {
  public isTextElement(abstractElement: ApplicationElement) {
    return typeof (abstractElement) === 'string' || typeof (abstractElement) === 'number';
  }

  public isArrayElement(abstractElement: ApplicationElement) {
    return Array.isArray(abstractElement);
  }

  public isDomElement(abstractElement: ApplicationElement) {
    if (this.isPlaceholderElement(abstractElement) === false && 
        this.isArrayElement(abstractElement) === false &&
        this.isTextElement(abstractElement) === false) {
      return typeof ((abstractElement as PlusnewAbstractElement).type) === 'string';
    }

    return false;
  }

  public isPlaceholderElement(abstractElement: ApplicationElement) {
    return abstractElement === false ||
           abstractElement === true ||
           abstractElement === null ||
           abstractElement === undefined;
  }

  public isComponentElement(abstractElement: ApplicationElement) {
    if (this.isArrayElement(abstractElement) === false &&
        this.isTextElement(abstractElement) === false &&
        this.isPlaceholderElement(abstractElement) === false) {
      return typeof ((abstractElement as PlusnewAbstractElement).type) !== 'string';
    }

    return false;
  }
}

export default new ElementTypeChecker();
