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
   * textnode is always a length of one
   */
  public getLength(): number {
    throw new Error('getLength of RootElement is irrelevant');
  }
}
