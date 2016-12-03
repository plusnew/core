import Class from 'class';

export default class {
  constructor() {
    this._ensureInstances()
        ._ensureUid();
  }

  create(path, props = {}) {
    const uid = this._incrementUid()._getCurrentUid();
    return this._createInstance(uid, path)
               ._createComponent(uid, props);
  }

  _ensureUid() {
    this._uid = 0;

    return this;
  }

  _incrementUid() {
    this._uid++;

    return this;
  }

  _getCurrentUid() {
    return this._uid;
  }

  _ensureInstances() {
    this._instances = {};

    return this;
  }

  _createInstance(uid, path) {
    const instance = new Class();
    instance._setUid(uid)
            ._setPath(path)
            ._setComponentsHandler(this);

    return this._setInstance(uid, instance);
  }

  _setInstance(uid, instance) {
    this._instances[uid] = instance;

    return this;
  }

  _getInstance(uid) {
    return this._instances[uid];
  }

  _createComponent(uid, props) {
    const instance = this._getInstance(uid);
    instance._setComponent(
      new this._getComponentClass(instance._getPath())(instance, props)
    );

    return instance;
  }

}
