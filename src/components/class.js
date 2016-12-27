function Component() {}

Component.prototype = {
  get(key) {
    console.log('getter of content', key);
  },

  set(key, content) {
    console.log('setter of content', key, content);

    return this;
  },

  exists(key) {
    console.log('exists', key);
  },

  unset(key) {
    console.log('unsetter of content', key);

    return this;
  },

  push(key, content) {
    console.log('pusher of content', key, content);

    return this;
  },

  pushOnce(key, content) {
    if (this.exists(key) === false) {
      this.push(key, content);
    }

    return this;
  },

  pop(key) {
    console.log('popper of content', key);

    return this;
  },

  shift(key) {
    console.log('shifter of content', key);

    return this;
  },

  remove(key) {
    console.log('remover of content', key);

    return this;
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

    return this._setTemplate();
  },

  _getPath() {
    return this._path;
  },

  _setTemplate() {
    const templates = this._getComponentsHandler()._getConfig().get('templates');
    if (templates[this._getPath()]) {
      this._template = new templates[this._getPath()](this._getUid() + '-');
    }

    return this;
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

  _ensureTemplate() {


    return this;
  },
};

export default Component;
