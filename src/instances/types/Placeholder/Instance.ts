import types from '../types';
import Instance from '../Instance';

export default class PlaceHolderInstance extends Instance {
  public nodeType = types.Placeholder;
  public type = types.Fragment;

  /**
   * the placeholder is not a dom object, that's why it has no length
   */
  public getLength() {
    return 0;
  }

  /**
   * placeholder has no object, which needs moving
   */
  public move() {
    // Because placeholders are not really inserted in the dom, no actual action is needed
    return this;
  }

  /**
   * placeholder has no object, which needs removing
   */
  public remove() {
    return this;
  }

  public reconcile(newAbstractElement: false) {
    return this;
  }
}
