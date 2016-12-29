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
    const componentHandler = new ComponentsHandler(new Config(config));
    this._componentHandlers.push(componentHandler);

    return componentHandler;
  },

  _createComponent(path, componentHandler) {
    const component = componentHandler.create(path);
    componentHandler.generateHtml(component)
                    .callInits().generateHtml(component);
    componentHandler.getView().append(componentHandler.getHtml());
    return componentHandler;
  },
};

export default Snew;
