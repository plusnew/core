import types from '../types';
import Instance from '../Instance';

export default class PlaceHolderInstance extends Instance {
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

  public reconcile(newAbstractElement: false) {}
}
