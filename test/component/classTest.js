/* global document, describe, beforeEach, it, expect, Snew, tempart */

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
    this.checkHtml = (componentHandler, expected) => {
      expect(componentHandler.template.getHtml()).toEqual(expected);
      expect(this.container.innerHTML).toEqual(expected);
    };

    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    Component = function (state) {
      this.state = state;

      this.state.foo = 'foo';
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

    this.snewInstance = new Snew(config);
  });

  it('text startup', function () {
    var componentHandler = this.snewInstance.create('main/app', {});
    componentHandler.appendToDom(this.container);
    this.checkHtml(componentHandler, '<span>I\'m an template</span>');
  });

  it('variable output', function () {
    config.templates['main/app'] = generateTemplate('<span>Hello {{$foo}}</span>');
    var componentHandler = this.snewInstance.create('main/app', {});
    componentHandler.appendToDom(this.container);
    this.checkHtml(componentHandler, '<span>Hello <span>foo</span></span>');
  });

  it('variable output with change afterwards', function () {
    config.templates['main/app'] = generateTemplate('<span>Hello {{$foo}}</span>');
    var componentHandler = this.snewInstance.create('main/app', {});
    window.componentHandler = componentHandler;
    window.component = componentHandler.component;
    componentHandler.appendToDom(this.container);
    componentHandler.component.state.foo = 'bar';
    this.checkHtml(componentHandler, '<span>Hello <span>bar</span></span>');
  });

  it('variable output with nested set', function () {
    config.templates['main/app'] = generateTemplate('<span>Hello {{$bar.baz}}</span>');
    var componentHandler = this.snewInstance.create('main/app', {});
    componentHandler.appendToDom(this.container);
    componentHandler.component.state.bar.baz = 'barbarbar';
    this.checkHtml(componentHandler, '<span>Hello <span>barbarbar</span></span>');
  });
});
