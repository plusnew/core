export default class {
  get(key) {
    console.log('future getter of content');
  }

  set(key, content) {
    console.log('future setter of content');
  }

  unset(key) {
    console.log('future unsetter of content');
  }

  push(key, content) {
    console.log('future pusher of content');
  }

  pushOnce(key, content) {
    console.log('future pushOncer of content');
  }

  pop(key) {
    console.log('future poper of content');
  }

  shift(key) {
    console.log('future shifter of content');
  }

  remove(key) {
    console.log('future remover of content');
  }

  _setComponent(component) {
    this._component = component;
  }
}
