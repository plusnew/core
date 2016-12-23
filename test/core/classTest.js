/* global describe, it, expect, snew */

// jshint varstmt: false
// jscs:disable requireTrailingComma
// jscs:disable maximumLineLength

var config = {
  path: 'main/app',
  components: {
    'main/app': function () {
      console.log('I am a class');
    }
  }
};

describe('Core functionality', function () {
  it('test startup', function () {
    snew.init(config);
    expect(true).toEqual(true);
  });
});
