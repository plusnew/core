/*global snew_core_class, module, window */

// jshint varstmt: false
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var snew = new snew_core_class.default();

if (typeof module === 'object') {
  module.exports = snew;
} else {
  window.snew = snew;
}
