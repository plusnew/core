import types from '../types';
import Instance from '../Instance';

export default class PlaceHolderInstance extends Instance {
  public type = types.PlaceHolder;

  /**
   * the placeholder is not a dom object, that's why it has no length
   */
  getLength() {
    return 0;
  }

  /**
   * placeholder has no object, which needs moving
   */
  move() {
    return this;
  }

  /**
   * placeholder has no object, which needs removing
   */
  remove() {
    return this;
  }
}
