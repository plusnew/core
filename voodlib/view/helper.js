require('jade/runtime');

export default vood.Obj({
	////-----------------------------------------------------------------------------------------
	// In which package does requirejs use the templates
	templatePrefix: 'templates/',
	////-----------------------------------------------------------------------------------------
	// object where all template functions are stored
	jst: {},
	////-----------------------------------------------------------------------------------------
	// Jquery selector where the this.startPath controller and view are added
	entrance: 'body',
	////-----------------------------------------------------------------------------------------
	// Controller which is added at startup
	startPath: 'main/app',
	////-----------------------------------------------------------------------------------------
	// domnode-attribute for start uid node
	uidDomNode: 'script',
	////-----------------------------------------------------------------------------------------
	// domnode-attribute for start uid node
	uidAttrStart: 'data-begin',
	////-----------------------------------------------------------------------------------------
	// domnode-attribute for end uid node
	uidAttrEnd: 'data-end',
	////-----------------------------------------------------------------------------------------
	// Existing classes collection
	list: {},
	////-----------------------------------------------------------------------------------------
	// JQuery events which the framework is listening for
	eventString: 'click submit change slide mouseover mouseout slideend mousemove mouseup mousedown keyup keydown drag dragstart dragover ',
	////-----------------------------------------------------------------------------------------
	// adds dirtychecking to runloop and inserts first view this.startPath and starts document event listener
	init: function(){
		if( this.dirtyHandling !== false ){
			this.addJob( {callback: this.dirtyChecking} );
		}
		this.checkValidity();
		this.insertTemplates();
		this.insertApp();
		this.addEvents();
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
		var dom = $( this.entrance );
		if( dom.length === 1 ) {
			$( this.entrance ).replaceWith( result.html );
		} else {
			console.error( 'vood.viewHelper.entrance was not represented in dom properly', dom );
		}
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
	compile: function( path, content ){
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
		return '<' +this.uidDomNode+ ' ' + this.uidAttrStart + '="' + id + '"></' +this.uidDomNode+ '>';
	},
	////-----------------------------------------------------------------------------------------
	// end uid
	scriptEnd: function( id ){
		return '<' +this.uidDomNode+ ' ' + this.uidAttrEnd   + '="' + id + '"></' +this.uidDomNode+ '>';
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
	// @TODO
	dirtyChecking: function(){
		
	},
	// iterates through all dom-nodes to the top and returns an array of controllers
	getParents: function( obj ){
		var result = [];
		while( obj.length > 0 ){
			// Needed handling with prev() instead of siblings(), to keep the order of the uids
			var prevObj = obj.prev();
			while( prevObj.length > 0 ){
				var uid = this.isUidObj( prevObj );
				if( uid ){
					result.push( uid );
				}
				prevObj = prevObj.prev();
			}
			obj = obj.parent();
		}
		return result;
	},
	// checks if dom-node is an uid-obj
	isUidObj: function( obj ){
		if( obj.is( this.uidDomNode + '[' + this.uidAttrStart + ']' )) {
			return obj.attr( this.uidAttrStart );
		}
	},
	////-----------------------------------------------------------------------------------------
	// adds all dom events which the framework ist listening for
	addEvents: function() {
		$('body').on(this.eventString, function(evt) {
			vood.viewHelper.handleEvent(evt);
		});
	},
	handleEvent: function( evt ){

	}
});