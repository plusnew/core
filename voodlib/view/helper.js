require('jade/runtime');

export default vood.Obj({
	templatePrefix: 'templates/',
	jst: {},
	entrance: 'body',
	startPath: 'main/app',
	uidAttrStart: 'data-begin',
	uidAttrEnd: 'data-end',
	list: {},
	////-----------------------------------------------------------------------------------------
	// adds dirtychecking to runloop and inserts first view this.startPath
	init: function(){
		if( this.dirtyHandling !== false ){
			this.addJob( {callback: this.dirtyChecking} );
		}
		this.checkValidity();
		this.insertTemplates();
		this.insertApp();
	},
	////-----------------------------------------------------------------------------------------
	// creates instance of view
	create: function( path, opt ){
		return this.getEntity(path);
	},
	////-----------------------------------------------------------------------------------------
	// searches for jade templates and adds to this.jst
	insertTemplates: function(){
		var seen = requirejs._eak_seen;
		for( var seenIndex in seen ){
			if( seenIndex.search( this.templatePrefix ) === 0 ){
				this.jst[ seenIndex ] = require( seenIndex ).default;
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// inserts first view to this.entrance
	insertApp: function(){
		var result = vood.controllerHelper.create( this.startPath, null, {} );
		$( this.entrance ).replaceWith( result.html );
	},
	////-----------------------------------------------------------------------------------------
	// gets class and returns instance
	getEntity: function( path ){
		if(!this.list[ path ]){
			console.log( 'View ' + path + ' does not exist' );
			vood.View( path, {_meta: {pseudo: true}} );
		}
		return _.cloneDeep(this.list[path]);
	},
	////-----------------------------------------------------------------------------------------
	// compiles the template with the corresponding content
	compileJade: function( path, content ){
		var name = this.templatePrefix + path;
		if( this.jst[ name ] ){
			return this.jst[ name ]( content );
		} else {
			console.error( path + ' no such template' );
			return '';
		}
	},
	////-----------------------------------------------------------------------------------------
	// start uid
	scriptStart: function( id ){
		return '<script ' + this.uidAttrStart + '="' + id + '"></script>';
	},
	////-----------------------------------------------------------------------------------------
	// end uid
	scriptEnd: function( id ){
		return '<script ' + this.uidAttrEnd   + '="' + id + '"></script>';
	},
	trigger: function( controllers, namespace, entity ){

	},
	////-----------------------------------------------------------------------------------------
	// some basic checking if values are correct
	checkValidity: function(){
		if( !this.entrance ){
			throw "App entrance is not defined";
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks which views are dirty, to asynchronoesly render them
	dirtyChecking: function(){
		
	}
});