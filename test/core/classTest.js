/* global document, describe, beforeEach, afterEach, it, expect, snew, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength



describe('Core functionality', function () {
  var config;
  beforeEach(function () {
    config = {
      useBrowser: false,
      path: 'main/app',
      components: {
        'main/app': function (snew) {
          this.s = snew;
        }
      },
      templates: {
        'main/app': tempart.factory('main/app', tempart.parser('I\'m an template>')),
      }
    };
  });

  it('test startup', function () {
    var componentContainer = snew.init(config);
    console.log(componentContainer.getHtml());
    expect(true).toEqual(true);
  });
});
