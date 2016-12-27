function View(config) {
  this._config = config;
}

View.prototype = {
  append(html) {
    if (this._config.get('useBrowser') && this._appended !== true) {
      this._appended = true;
      console.log('not yet imlemented', html);
    }

    return this;
  },

  render(component) {
    return component._template.clean(component._content).html;
  },
};

export default View;
