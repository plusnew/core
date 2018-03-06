import types from '../types';
import Instance from '../Instance';

export default class PlaceHolderInstance extends Instance {
  public type = types.Placeholder;

  /**
   * the placeholder is not a dom object, that's why it has no length
   */
  getLength() {
    return 0;
  }

  /**
   * placeholder has no object, which needs moving
   */
  move(): never {
    // This line should never be executed, please create a github-issue how to reproduce that
    throw new Error('Placeholder elements cant be moved');
  }

  /**
   * placeholder has no object, which needs removing
   */
  remove() {
    return this;
  }
}
