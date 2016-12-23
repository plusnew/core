import util from '../helpers/util';
import Component from './class';

function ComponentsHandler(config) {
  this._setConfig(config)
      ._ensureInstances()
      ._ensureUid();
}

ComponentsHandler.prototype = {
  create(path, props = {}) {
    const uid = this._incrementUid()._getCurrentUid();
    return this._createInstance(uid, path)
               ._createComponent(uid, props);
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

  _ensureInstances() {
    this._instances = {};

    return this;
  },

  _createInstance(uid, path) {
    const instance = new Component();
    instance._setUid(uid)
            ._setPath(path)
            ._setComponentsHandler(this);

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

    return instance;
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
