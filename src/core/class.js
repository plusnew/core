import ComponentsHandler from '../components/handler';

function Snew() {
  this._ensureComponentHandlers()
      ._createComponentHandler();
}

Snew.prototype = {
  init(config) {
    this._createComponent(config.path);

    return this;
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
    this._componentHandlers.push(new ComponentsHandler());

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
