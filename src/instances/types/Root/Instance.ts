import types from '../types';
import Instance from '../Instance';

export default class RootInstance extends Instance {
  public type = types.Root;
  public ref: Element;

  /**
   * appends the element to the rootcontainer
   */
  public appendChild(element: Element) {
    this.ref.appendChild(element);

    return this;
  }

  /**
   * Root is no child of nobody, because of that nobody should care how long it is
   */
  public getLength(): number {
    throw new Error('getLength of RootElement is irrelevant');
  }

  /**
   * Nobody is above the root, and because of that nobody is able to move the root
   */
  public move(): never {
    throw new Error('The root element can\'t remove itself');
  }

  /**
   * Nobody is above the root, and because of that nobody is able to remove the root
   */
  public remove(): never {
    throw new Error('The root element can\'t remove itself');
  }
}
