import ComponentsHandler from '../components/handler';
import Config from './config';

function Snew() {
  this._ensureConfig()
      ._ensureComponentHandlers();
}

Snew.prototype = {
  init(config) {
    this._setConfig(config);
    const componentHandler = this._createComponentHandler();
    this._createComponent(config.path, componentHandler);

    return componentHandler;
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
    const componentHandler = new ComponentsHandler(this._getConfig());
    this._componentHandlers.push(componentHandler);

    return componentHandler;
  },

  _createComponent(path, componentHandler) {
    const component = componentHandler.create(path);
    componentHandler.generateHtml(component)
                    .callInits();
    componentHandler.getView().append(this._getConfig(), componentHandler.getHtml());
    return componentHandler;
  },
};

export default Snew;
