import util from '../helpers/util';
import Component from './class';
import View from '../view/class';

function ComponentsHandler(id, config) {
  this._setId(id)
      ._setConfig(config)
      ._ensureView()
      ._ensureInstances()
      ._ensureInits()
      ._ensureUid();
}

ComponentsHandler.prototype = {
  create(path, props = {}) {
    const uid = this._incrementUid()._getCurrentUid();
    return this._createInstance(uid, path)
               ._createComponent(uid, props);
  },

  _setId(id) {
    this._id = id;

    return this;
  },

  _setConfig(config) {
    this._config = config;

    return this;
  },

  _getConfig() {
    return this._config;
  },

  _ensureUid() {
    this._uid = 0;

    return this;
  },

  _incrementUid() {
    this._uid++;

    return this;
  },

  _getCurrentUid() {
    return this._uid;
  },

  _ensureView() {
    this._view = new View(this._getConfig());

    return this;
  },

  getView() {
    return this._view;
  },

  _ensureInstances() {
    this._instances = {};

    return this;
  },

  _ensureInits() {
    this._inits = [];

    return this;
  },

  _createInstance(uid, path) {
    const instance = new Component();
    instance._setUid(uid)
            ._setComponentsHandler(this)
            ._setPath(path);

    return this._setInstance(uid, instance);
  },

  _setInstance(uid, instance) {
    this._instances[uid] = instance;

    return this;
  },

  _getInstance(uid) {
    return this._instances[uid];
  },

  _createComponent(uid, props) {
    const instance = this._getInstance(uid);
    const Component = this._getComponentClass(instance._getPath());
    instance._setComponent(new Component(instance, props));
    this._addInit(uid);

    return instance;
  },

  _addInit(uid) {
    this._inits.push(uid);

    return this;
  },

  addRoot(component) {
    this.generateHtml(component);

    // @TODO probably should add recursion protection
    while (this.callInits()) {
      this.generateHtml(component);
    }

    this.getView().append(this.getHtml());

    return this;
  },

  callInits() {
    let initsCalled = false;
    for (let i = 0; i < this._inits.length; i++) {
      const uid = this._inits.pop();
      if (this._instances[uid]) {
        const component = this._instances[uid]._getComponent();
        if (util.isFunction(component.init)) {
          component.init();
          initsCalled = true;
        }
      }
    }

    return initsCalled;
  },

  generateHtml(component) {
    this._html = this.getView().render(component);

    return this;
  },

  getHtml() {
    return this._html;
  },

  _getComponentClass(path) {
    const components = this._getConfig().get('components');
    if (components[path] === undefined) {
      throw new Error('The component ' + path + ' is not known to snew');
    } else if (util.isFunction(components[path]) === false) {
      throw new Error('The component ' + path + ' is not a Class/Function');
    }

    return components[path];
  },
};

export default ComponentsHandler;
