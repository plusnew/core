function Config(config) {
  this._set(config);
}

Config.prototype = {
  /**
   * do not modify this object at runtime, it would be shared for all configuration instances
   */
  _defaultConfig: {
    useBrowser: true,
  },
  _set(config) {
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
    } else if (this._config[key] !== undefined) {
      return this._config[key];
    } else if (this._defaultConfig[key] !== undefined) {
      return this._defaultConfig[key];
    } else {
      throw 'No configuration found for ' + key;
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
