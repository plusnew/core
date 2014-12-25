var mergeTrees     = require('broccoli-merge-trees');
var compileES6     = require('broccoli-es6-concatenator');
var pickFiles      = require('broccoli-static-compiler');
var findBowerTrees = require('broccoli-bower');
var Filter         = require('broccoli-filter');
var env            = require('broccoli-env').getEnv();
var Filter         = require('broccoli-filter');
var jade           = require('jade');
var jadeCompiler   = require('./node_modules/jade/lib/compiler.js');

var app = 'app';
app = pickFiles(app, {
	srcDir: '/',
	destDir: 'appkit' // move under appkit namespace
});

var vood = 'voodlib';
vood = pickFiles( vood, {
	srcDir: '/',
	destDir: 'voodkit' // move under appkit namespace
});

var vendor = 'vendor';
var bower = 'bower_components';

var templates = 'app/templates';
templates = pickFiles( templates, {
	srcDir: '/',
	destDir: 'templates' // move under appkit namespace
});

function insertAt( src, position, str ){
	return src.substr( 0, position ) + str + src.substr( position );
}

function Compiler(node, options) {
	this.options = options = options || {};
	this.node = node;
	this.hasCompiledDoctype = false;
	this.hasCompiledTag = false;
	this.pp = options.pretty || false;
	this.debug = false !== options.compileDebug;
	this.indents = 0;
	this.parentIndents = 0;
	this.terse = false;
	this.mixins = {};
	this.dynamicMixins = true;
	if (options.doctype) this.setDoctype(options.doctype);
}

for( var index in jadeCompiler.prototype ) {
	Compiler.prototype[index] = jadeCompiler.prototype[index];
}


function JadeFilter( inputTree, options ){
	if( !( this instanceof JadeFilter )){
		return new JadeFilter( inputTree, options );
	}

	this.inputTree = inputTree;
	this.options = options || {};
}

JadeFilter.prototype = Object.create( Filter.prototype );
JadeFilter.prototype.constructor = JadeFilter;

JadeFilter.prototype.extensions = [ 'jade' ];
JadeFilter.prototype.targetExtension = 'js';

JadeFilter.prototype.processString = function( str, filename ){
	this.options.filename = filename;
	var compiled = jade.compileClient( str, this.options ) + ';\nexport default template;';

	var parts = compiled.split( ';' );
	var foundAdd      = false;
	var foundFinished = false;
	for( var i = 0; i < parts.length; i++ ){
		var isMixin = parts[ i ].search( 'jade_mixins' ) != -1;
		if( isMixin && foundAdd === false ){ // Adds global mixins to this template
			parts[ i ] += ';vood.viewJade.addMixins(jade_mixins, buf)';
			foundAdd = true;
		} else if( isMixin ){ // Manipulates the mixin calls to add the parameter 'buf'
			var functionBegin = parts[ i ].search( /\(/ ) + 1;
			var functionEnd   = parts[ i ].search( /\)/ );
			var parameter     = parts[ i ].substring(functionBegin, functionEnd);
			var newParam      = 'buf';
			if(parameter) {
				newParam += ', ';
			}
			parts[ i ] = insertAt( parts[ i ], functionBegin, newParam );
		}
		if( parts[ i ].search('return buf.join') !== -1 && foundFinished === false ){
			parts[i - 1] += ';vood.viewJade.mixinFinished(jade_mixins)';
			foundFinished = true;
		}
	}
	return parts.join( ';' );
};

templates = JadeFilter( templates, {compiler: Compiler} );

var sourceTrees = [ app, vood, vendor, bower, templates ];
sourceTrees = sourceTrees.concat( findBowerTrees() );

var appAndDependencies = new mergeTrees( sourceTrees, { overwrite: true } );

var appJs = compileES6( appAndDependencies, {
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

module.exports = mergeTrees( [ appJs, publicFiles ] );