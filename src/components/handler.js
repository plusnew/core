import Class from 'class';

export default class {
  constructor() {
    this._ensureInstances()
        ._ensureUid();
  }

  create(path, props = {}) {
    return this._incrementUid()
               ._createInstance(path)
               ._createComponent(path, props);
  }

  _ensureUid() {
    this._uid = 0;

    return this;
  }

  _incrementUid() {
    this._uid++;

    return this;
  }

  _getUid() {
    return this._uid;
  }

  _ensureInstances() {
    this._instances = {};

    return this;
  }

  _createInstance(path) {
    const instance = new Class();
    instance._setUid(this._getUid())
            ._setPath(path)
            ._setComponentsHandler(this);

    return this._setInstance(instance._getUid(), instance);
  }

  _setInstance(uid, instance) {
    this._instances[uid] = instance;

    return this;
  }

  _getInstance(uid) {
    return this._instances[uid];
  }

  _createComponent(path, props) {
    const instance = this._getInstance(this._getUid());
    instance._setComponent(
      new this._getComponentClass(path)(instance, props)
    );

    return instance;
  }

}
