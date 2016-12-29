/* global document, describe, beforeEach, afterEach, it, expect, snew, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

function generateTemplate(templateString) {
  return tempart.factory('main/app', tempart.parser(templateString));
}

function Component(snew) {
  this.s = snew;

  this.content = {
    foo: 'bar'
  };
}

Component.prototype = {
  init: function () {
    this.s.set(['foo'], 'bar');
  },
};

describe('Core functionality', function () {
  var config;
  beforeEach(function () {
    config = {
      useBrowser: false,
      path: 'main/app',
      components: {
        'main/app': Component
      },
      templates: {
        'main/app': generateTemplate('I\'m an template')
      }
    };
  });

  it('text startup', function () {
    var componentContainer = snew.init(config);
    expect(componentContainer.getHtml()).toEqual('<span data-snew-id="1-1">I\'m an template</span>');
  });

  it('text startup', function () {
    config.templates['main/app'] = generateTemplate('<span>Hello {{foo}}</span>');
    var componentContainer = snew.init(config);
    expect(componentContainer.getHtml()).toEqual('<span data-snew-id="1-1">Hello <span data-snew-id="1-3">bar</span></span>');
  });
});
