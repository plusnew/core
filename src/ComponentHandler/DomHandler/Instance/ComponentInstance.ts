import types from './types';
import Instance from './Instance';

export default class ComponentInstance extends Instance {
  public type = types.Component;

  /**
   * the length is dependent on the length of the amount of root-elements and the length from them
   */
  public getLength() {
    return 0;
  }
}
