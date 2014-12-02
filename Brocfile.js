var mergeTrees = require('broccoli-merge-trees');
var compileES6 = require('broccoli-es6-concatenator');
var pickFiles = require('broccoli-static-compiler');
var findBowerTrees = require('broccoli-bower');
var Filter = require('broccoli-filter');
var env = require('broccoli-env').getEnv();
var Filter = require('broccoli-filter');
var jade = require('jade');

var app = 'app';
app = pickFiles(app, {
	srcDir: '/',
	destDir: 'appkit' // move under appkit namespace
});

var vood = 'voodlib';
vood = pickFiles(vood, {
	srcDir: '/',
	destDir: 'voodkit' // move under appkit namespace
});

var vendor = 'vendor';
var bower = 'bower_components';

var templates = 'app/templates';
templates = pickFiles(templates, {
	srcDir: '/',
	destDir: 'templates' // move under appkit namespace
});


function JadeFilter(inputTree, options) {
	if (!(this instanceof JadeFilter)) {
		return new JadeFilter(inputTree, options);
	}

	this.inputTree = inputTree;
	this.options = options || {};
}

JadeFilter.prototype = Object.create(Filter.prototype);
JadeFilter.prototype.constructor = JadeFilter;

JadeFilter.prototype.extensions = ['jade'];
JadeFilter.prototype.targetExtension = 'js';

JadeFilter.prototype.processString = function (str, filename) {
	this.options.filename = filename;
	var compiled = jade.compileClient(str, this.options) + ';\nexport default template;';

	var parts = compiled.split(';');
	var found = false;
	for(var i = 0; i < parts.length; i++) {
		if(parts[i].search('jade_mixins') != -1 && found === false) {
			parts[i] += ';vood.viewJade.addMixins(jade_mixins, buf)';
			found = true;
		}
	}
	return parts.join(';');
};

templates = JadeFilter(templates, {});

var sourceTrees = [app, vood, vendor, bower, templates];
sourceTrees = sourceTrees.concat(findBowerTrees());

var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true });

var appJs = compileES6(appAndDependencies, {
	loaderFile: 'loader.js',
	inputFiles: [ // Change that to recursive
		'voodkit/*.js',
		'voodkit/**/*.js',
		'appkit/*.js',
		'appkit/**/*.js',
		'appkit/**/**/*.js',
		'templates/**/*.js',
		'jade/runtime.js'
	],
	legacyFilesToAppend: [
		'jquery.js',
		'lodash.compat.js'
	],
	wrapInEval: env !== 'production',
	outputFile: '/assets/app.js'
});



var publicFiles = 'public';

module.exports = mergeTrees([appJs, publicFiles]);