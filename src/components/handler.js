import Class from 'class';

var handler = {
  _uid: 0,
  _instances: {},
  
  create(path, props) {
    this._incrementUid()
        ._createInstance(path)
        ._createComponent(path, props);
  },

  _incrementUid() {
    this._uid++;
    return this;
  },

  _createInstance(path) {
    this._instances[this._uid] = new Class(path, this._uid);
    return this;
  },

  _createComponent(path, props) {
    const instance = this._getInstance(uid);
    instance._setComponent(
      new this._getComponentClass(path)(instance, props)
    );
  },

  _getInstance(uid) {
    return this._instances[uid];
  },
};
