import Instance from '../Instance';
import types from '../types';

/**
 * PlaceholderInstance is a representation of {false}
 * it is used for conditions which don't want to show something
 */
export default class PlaceholderInstance extends Instance {
  public nodeType = types.Placeholder;
  public type = types.Fragment;


  public getLastIntrinsicElement() {
    return null;
  }

  /**
   * placeholder has no object, which needs moving
   */
  public move() {
    // Because placeholders are not really inserted in the dom, no actual action is needed
  }

  /**
   * placeholder has no object, which needs removing
   */
  public remove() {}

  /**
   * a placeholder is just a element waiting to be exchanged with something else
   * but it itself doesn't need to be updated
   */
  public reconcile(newAbstractElement: false) {}
}
