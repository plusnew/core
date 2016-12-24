function Config() {}

Config.prototype = {
  set(config) {
    if (this._config === undefined) {
      this._config = config;
    } else {
      throw new Error('Config was already set');
    }

    return this._validate();
  },

  get(key) {
    if (this._config === undefined) {
      throw new Error('Config is not set yet');
    } else {
      return this._config[key];
    }
  },

  _validate() {
    return this._validateComponents()
               ._validatePath();
  },

  _validateComponents() {
    if (!this._config.components) {
      throw new Error('The config has to have a components object');
    }

    return this;
  },

  _validatePath() {
    if (!this._config.path) {
      throw new Error('The config has to have a path-string');
    }

    return this;
  },
};

export default Config;
