import ComponentsHandler from '../components/handler';
import Config from './config';

function Snew() {
  this._ensureConfig()
      ._ensureComponentHandlers()
      ._createComponentHandler();
}

Snew.prototype = {
  init(config) {
    this._setConfig(config)
        ._createComponent(config.path);

    return this;
  },

  _ensureConfig() {
    this._config = new Config();

    return this;
  },

  _setConfig(config) {
    this._config.set(config);

    return this;
  },

  _getConfig() {
    return this._config;
  },

  _ensureComponentHandlers() {
    this._componentHandlers = [];

    return this;
  },

  _getComponentHandlers() {
    return this._componentHandlers;
  },

  _getComponentHandler(index) {
    return this._componentHandlers[index];
  },

  _createComponentHandler() {
    this._componentHandlers.push(new ComponentsHandler(this._getConfig()));

    return this;
  },

  _getComponentHandlerLength() {
    return this._getComponentHandlers().length;
  },

  _getComponentHandlerLast() {
    return this._getComponentHandler(this._getComponentHandlerLength() - 1);
  },

  _createComponent(path) {
    this._getComponentHandlerLast().create(path);

    return this;
  },
};

export default Snew;
