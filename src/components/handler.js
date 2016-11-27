import Class from 'class';

export default class {
  constructor() {
    this._ensureInstances()
        ._ensureUid();
  }

  create(path, props = {}) {
    this._incrementUid()
        ._createInstance(path)
        ._createComponent(path, props);
  }

  _ensureInstances() {
    this._instances = {};
    return this;
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

  _createInstance(path) {
    const uid = this._getUid();
    this._instances[uid] = new Class(path, uid);
    return this;
  }

  _createComponent(path, props) {
    const instance = this._getInstance(this._getUid());
    instance._setComponent(
      new this._getComponentClass(path)(instance, props)
    );
  }

  _getInstance(uid) {
    return this._instances[uid];
  }
}
