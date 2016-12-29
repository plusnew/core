import ComponentsHandler from '../components/handler';
import Config from './config';

function Snew() {
  this._ensureComponentHandlers();
}

Snew.prototype = {
  init(config) {
    const componentHandler = this._createComponentHandler(config);
    this._createComponent(config.path, componentHandler);

    return componentHandler;
  },

  _ensureComponentHandlers() {
    this._componentHandlers = [];

    return this;
  },

  _createComponentHandler(config) {
    const index = this._componentHandlers.length - 1;
    const componentHandler = new ComponentsHandler(index, new Config(config));
    this._componentHandlers.push(componentHandler);

    return componentHandler;
  },

  _createComponent(path, componentHandler) {
    const component = componentHandler.create(path);
    componentHandler.addRoot(component);
    return componentHandler;
  },
};

export default Snew;
