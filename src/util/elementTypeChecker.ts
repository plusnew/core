import { ApplicationElement } from 'interfaces/component';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

class ElementTypeChecker {
  public isTextElement(abstractElement: ApplicationElement) {
    return typeof (abstractElement) === 'string';
  }

  public isArrayElement(abstractElement: ApplicationElement) {
    return Array.isArray(abstractElement);
  }

  public isDomElement(abstractElement: ApplicationElement) {
    if (this.isArrayElement(abstractElement) === false && this.isTextElement(abstractElement) === false) {
      return typeof ((abstractElement as PlusnewAbstractElement).type) === 'string';
    }

    return false;
  }

  public isComponentElement(abstractElement: ApplicationElement) {
    if (this.isArrayElement(abstractElement) === false && this.isTextElement(abstractElement) === false) {
      return typeof ((abstractElement as PlusnewAbstractElement).type) !== 'string';
    }

    return false;
  }
}

export default new ElementTypeChecker();
