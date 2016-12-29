function View(config) {
  this._config = config;
}

View.prototype = {
  append(html) {
    if (this._config.get('useBrowser') && this._appended !== true) {
      this._appended = true;
      this._config.get('entry').innerHTML = html;
    }

    return this;
  },

  render(instance) {
    return instance._template.clean(instance._getComponent().content).html;
  },
};

export default View;
