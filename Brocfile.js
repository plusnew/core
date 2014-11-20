var mergeTrees = require('broccoli-merge-trees');
var compileES6 = require('broccoli-es6-concatenator');
var pickFiles = require('broccoli-static-compiler');
var findBowerTrees = require('broccoli-bower');
var env = require('broccoli-env').getEnv();

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

var sourceTrees = [app, vood, vendor];
sourceTrees = sourceTrees.concat(findBowerTrees());

var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true });
console.log(appAndDependencies.inputTrees);
var appJs = compileES6(appAndDependencies, {
	loaderFile: 'loader.js',
	inputFiles: [ // Change that to recursive
		'voodkit/*.js',
		'voodkit/**/*.js',
		'appkit/**/**/*.js',
		'appkit/**/**/*.js',
		'appkit/**/*.js',
		'appkit/*.js'
	],
	legacyFilesToAppend: [
		'jquery.js',
		'handlebars.js',
		'lodash.js'
	],
	wrapInEval: env !== 'production',
	outputFile: '/assets/app.js'
});

var publicFiles = 'public';

module.exports = mergeTrees([appJs, publicFiles]);