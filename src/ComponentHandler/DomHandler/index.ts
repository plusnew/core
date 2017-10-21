// import PlusnewAbstractElement from 'PlusnewAbstractElement';
// import ComponentHandler from 'ComponentHandler';
import { ApplicationElement } from 'interfaces/component';
import Instance from './Instance/Instance';
import factory from './Instance/factory';
import reconciler from './reconciler';

/**
 * The createElement can be called with a domnode, a component, or a text
 */

export default class DomHandler {
  private parentInstance: Instance;
  private previousAbstractSiblingCount: () => number;
  private root: Instance;
  constructor(parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    this.parentInstance = parentInstance;
    this.previousAbstractSiblingCount = previousAbstractSiblingCount;
  }

  /**
   * is responsible for creating the dom elements for the container
   */
  public create(newAbstractElements: ApplicationElement) {
    this.root = factory(newAbstractElements, this.parentInstance, this.previousAbstractSiblingCount);

    return this;
  }

  /**
   * updates the dom and does the reconciliation
   */
  public update(newAbstractElements: ApplicationElement) {
    reconciler.update(newAbstractElements, this.root);

    return this;
  }
}
