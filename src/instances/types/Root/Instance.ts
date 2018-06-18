import { ApplicationElement } from '../../../interfaces/component';
import Instance, { getPredeccessor } from '../Instance';
import types from '../types';

type renderOptions = {
  createChildrenComponents?: boolean;
  namespace?: string;
};

export default class RootInstance extends Instance {
  public nodeType = types.Root;
  public type = types.Root;
  public ref: Element;

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance | undefined,
    getPredecessor: getPredeccessor,
    options?: renderOptions,
  ) {
    super(abstractElement, parentInstance, getPredecessor);

    if (options) {
      if (options.namespace !== undefined) {
        this.namespace = options.namespace;
      }

      if (options.createChildrenComponents !== undefined) {
        this.createChildrenComponents = options.createChildrenComponents;
      }
    }
  }
  /**
   * appends the element to the rootcontainer
   */
  public appendChild(element: Element) {
    this.ref.appendChild(element);
  }

  public getLastIntrinsicElement() {
    return this.ref;
  }

  /**
   * Nobody is above the root, and because of that nobody is able to move the root
   */
  public move(): never {
    throw new Error('The root element can\'t move itself');
  }

  /**
   * Nobody is above the root, and because of that nobody is able to remove the root
   */
  public remove(): never {
    throw new Error('The root element can\'t remove itself');
  }

  /**
   * a root instance isn't anything updatable
   */
  public reconcile(newAbstractElement: false): never {
    throw new Error('The root element can\'t reconcile itself');
  }
}

export { renderOptions };
