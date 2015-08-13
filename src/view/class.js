
var classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'view',
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'controller.content',
		////-----------------------------------------------------------------------------------------
		// current values for checking context
		currentValues: [],
		////-----------------------------------------------------------------------------------------
		// Keeps in mind what keys did get dirty, to only change that
		dirty: {}
	},
	////-----------------------------------------------------------------------------------------
	// array of eventdefinitions
	events: [],
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered
	construct: function(){},
	////-----------------------------------------------------------------------------------------
	// Gets triggered each time after the template got rerendered
	notify: function(){},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_triggerEvent: function( func, data, event, target ){

	},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_render: function(){
		this._compile( this._meta.dirty );
		this._meta.dirty = {}; // There will everything be in

		vood.utilHelper.safeCall( this.controller, 'notify' );
		vood.utilHelper.safeCall( this, 'notify' );
	},
	////-----------------------------------------------------------------------------------------
	// Trigger templateHelper
	_compile: function(dirties){
		return vood.templateHelper.compile(
			this.controller._meta.path,
			this.controller._meta.uid,
			this.controller.content,
			this._meta.currentValues,
			dirties,
			this._meta.path
		);
	},
	////-----------------------------------------------------------------------------------------
	// Triggers compilefunction but adds script-tags with uid
	_compileComplete: function(){
		var id = this.controller._meta.uid;
		return vood.viewHelper.scriptStart( id, this._meta.path ) + this._compile('*') + vood.viewHelper.scriptEnd( id );
	},
	////-----------------------------------------------------------------------------------------
	// Registers what keys got dirty
	_addDirty: function( key, type, value ) {
		if(!this._meta.dirty[key] || type === 'set') this._meta.dirty[key] = [];
		// @TODO add handling for pop/shift + push/unshift
		this._meta.dirty[key].push({type, value});
		vood.viewHelper.pushOnce('dirties', this.controller._meta.uid);
	},
	////-----------------------------------------------------------------------------------------
	// Works the dirties
	_handleDirties: function() {
		// @TODO this._meta.dirty needs grouping for unsift and push
		// this._compile(this._meta.dirty);
		this._meta.dirty = {};
	},
	////-----------------------------------------------------------------------------------------
	// returns jquery object depending selector
	obj: function( path ){
		var selector = null;
		var id = this.controller._meta.uid;
		var startUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrStart + '=' + id + ']';
		var endUid   = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrEnd + '=' + id +']';
		var root = $( startUid ).nextUntil( endUid );
		if( path !== 'root' ){
			if( !this[ path ] ){
				throw 'Couldnt get you the obj because of missing definition';
			}
			selector = this[ path ];
			return $.merge( root.filter( selector ), root.children( selector )); // we want the top and the children
		} else {
			return root;
		}
		
	}
};

////-----------------------------------------------------------------------------------------
// Function for creating classes
function view( path, obj ){
	if( vood.viewHelper.list[ path ] ){
		console.warn( 'The View for ' + path + ' already exists' );
	} else {
		vood.viewHelper.list[ path ] = vood.Obj( 'view', path, obj );
		vood.utilHelper.merge( vood.viewHelper.list[ path ], classContent );
	}
}

export default view;