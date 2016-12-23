function Config() {}

Config.prototype.set = function (config) {
  if (this._config === undefined) {
    this._config = config;
  } else {
    throw new Error('Config was already set');
  }

  return this._validate();
};

Config.prototype.get = function (key) {
  if (this._config === undefined) {
    throw new Error('Config is not set yet');
  } else {
    return this._config[key];
  }
};

Config.prototype._validate = function () {
  if (!this._config.components) {
    throw new Error('The config has to have a components object');
  }

  return this;
};

export default Config;
