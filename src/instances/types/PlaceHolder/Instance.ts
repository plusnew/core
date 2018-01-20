import types from '../types';
import Instance from '../Instance';

export default class PlaceHolderInstance extends Instance {
  public type = types.PlaceHolder;

  getLength() {
    return 0;
  }

  remove() {
    return this;
  }
}
