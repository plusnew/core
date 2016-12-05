import ComponentsHandler from 'snew/components/handler';

function Snew(config) {
  this._ensureComponentHandlers()
      ._createComponentHandler()
      ._createComponent(config.path);
}

Snew.prototype = {
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
