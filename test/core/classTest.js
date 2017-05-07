/* global document, describe, beforeEach, afterEach, it, expect, Snew, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

function generateTemplate(templateString) {
  return tempart.factory('main/app', tempart.parser(templateString));
}

describe('Core functionality', function () {
  var config;
  var Component;
  beforeEach(function () {
    Component = function (snew) {
      this.s = snew;

      this.content = {
        foo: 'foo'
      };
    };

    config = {
      useBrowser: false,
      rootPath: 'main/app',
      components: {
        'main/app': Component
      },
      templates: {
        'main/app': generateTemplate('I\'m an template')
      }
    };
  });

  it('text startup', function () {
    var componentContainer = new Snew(config);
    expect(componentContainer.getHtml()).toEqual('<span data-snew-id="1-1">I\'m an template</span>');
  });

  // it('variable output', function () {
  //   config.templates['main/app'] = generateTemplate('<span>Hello {{foo}}</span>');
  //   var componentContainer = new Snew(config);
  //   expect(componentContainer.getHtml()).toEqual('<span data-snew-id="1-1">Hello <span data-snew-id="1-3">foo</span></span>');
  // });

  // it('variable output with init', function () {
  //   config.templates['main/app'] = generateTemplate('<span>Hello {{foo}}</span>');
  //   Component.prototype = {
  //     init: function () {
  //       this.s.set(['foo'], 'bar');
  //     },
  //   };

  //   var componentContainer = new Snew(config);
  //   expect(componentContainer.getHtml()).toEqual('<span data-snew-id="1-1">Hello <span data-snew-id="1-3">bar</span></span>');
  // });
});
