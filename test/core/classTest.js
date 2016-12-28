/* global describe, it, expect, snew, tempart */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

var config = {
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

describe('Core functionality', function () {
  it('test startup', function () {
    snew.init(config);
    expect(true).toEqual(true);
  });
});
