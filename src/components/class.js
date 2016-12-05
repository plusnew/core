function Component() {}

Component.prototype = {
  get(key) {
    console.log('getter of content');
  },

  set(key, content) {
    console.log('setter of content');

    return this;
  },

  exists(key) {
    console.log('exists');
  },

  unset(key) {
    console.log('unsetter of content');

    return this;
  },

  push(key, content) {
    console.log('pusher of content');

    return this;
  },

  pushOnce(key, content) {
    if (this.exists(key) === false) {
      this.push(key, content);
    }

    return this;
  },

  pop(key) {
    console.log('popper of content');
  },

  shift(key) {
    console.log('shifter of content');
  },

  remove(key) {
    console.log('remover of content');
  },

  _setUid(uid) {
    this._uid = uid;

    return this;
  },

  _getUid() {
    return this._uid;
  },

  _setPath(path) {
    this._path = path;

    return this;
  },

  _getPath() {
    return this._path;
  },

  _setComponent(component) {
    this._component = component;

    return this;
  },

  _getComponent() {
    return this._component;
  },

  _setComponentsHandler(handler) {
    this._componentsHandler = handler;

    return this;
  },

  _getComponentsHandler() {
    return this._componentsHandler;
  },
};

export default Component;
