/* global describe, beforeEach, it, expect, Snew, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

function generateTemplate(templateString) {
  return tempart.factory('main/app', tempart.parse(templateString))
}

describe('Core functionality', function () {
  var config;
  var Component;
  beforeEach(function () {
    Component = function (state) {
      this.state = state;

      this.state.foo = 'foo',
      this.state.bar = {
        baz: 'barbar',
      };
    };

    config = {
      components: {
        'main/app': Component
      },
      templates: {
        'main/app': generateTemplate('I\'m an template')
      }
    };
  });

  it('text startup', function () {
    var snewInstance = new Snew(config);
    var componentHandler = snewInstance.init('main/app', {});
    console.log(componentHandler.template);
    expect(componentHandler.template.getHtml()).toEqual('<span>I\'m an template</span>');
  });

  // it('variable output', function () {
  //   config.templates['main/app'] = generateTemplate('<span>Hello {{foo}}</span>');
  //   var componentContainer = new Snew(config);
  //   expect(componentContainer.compileTemplate()).toEqual('<span>Hello <span>foo</span></span>');
  // });

  // it('variable output with init', function () {
  //   config.templates['main/app'] = generateTemplate('<span>Hello {{foo}}</span>');
  //   Component.prototype = {
  //     init: function () {
  //       this.state.foo = 'bar';
  //     },
  //   };

  //   var componentContainer = new Snew(config);
  //   expect(componentContainer.compileTemplate()).toEqual('<span>Hello <span>bar</span></span>');
  // });

  // it('variable output with nested set', function () {
  //   config.templates['main/app'] = generateTemplate('<span>Hello {{bar.baz}}</span>');
  //   Component.prototype = {
  //     init: function () {
  //       this.state.bar.baz = 'barbarbar';
  //     },
  //   };

  //   var componentContainer = new Snew(config);
  //   expect(componentContainer.compileTemplate()).toEqual('<span>Hello <span>barbarbar</span></span>');
  // });
});
