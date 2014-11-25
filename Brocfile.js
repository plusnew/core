var mergeTrees = require('broccoli-merge-trees');
var compileES6 = require('broccoli-es6-concatenator');
var pickFiles = require('broccoli-static-compiler');
var findBowerTrees = require('broccoli-bower');
var env = require('broccoli-env').getEnv();
var jade = require('broccoli-jade');

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

var templates = 'app/templates';
templates = pickFiles(templates, {
	srcDir: '/',
	destDir: 'templates' // move under appkit namespace
});

jade.prototype.targetExtension = 'js';

templates = jade(templates, {client: true});
console.log(templates);

var sourceTrees = [app, vood, vendor, templates];
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
	],
	legacyFilesToAppend: [
		'jquery.js',
		'lodash.js'
	],
	wrapInEval: env !== 'production',
	outputFile: '/assets/app.js'
});



var publicFiles = 'public';

module.exports = mergeTrees([appJs, publicFiles]);