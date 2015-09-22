
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
		currentValues: {},
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
	// updates the currentValue of the specified attribute/value
	_updateCurrent: function( blockId, attribute, value) {
		var attributeBlock = snew.templateHelper.getDependency( this._meta.path, blockId, attribute );
		var block = this._searchBlock( blockId, attributeBlock.id, value );
		for( var i = 0; i < attributeBlock.depending.length; i++ ){
			this.controller.set(attributeBlock.depending[ i ], value);
		}
	},

	_searchBlock: function( blockId, attributeId, value ){
		var parts  = blockId.split( '-' );
		var blocks = this._meta.currentValues;
		var block  = null;
		// @TODO implement it working for loops
		for( var i = 0; i < parts.length; i++ ){
			blocks = blocks[ parts[ i ]];
			blocks[attributeId] = value;
		}
	},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_render: function(){
		this._compile( this._meta.dirty );
		this._meta.dirty = {}; // There will everything be in

		snew.utilHelper.safeCall( this.controller, 'notify' );
		snew.utilHelper.safeCall( this, 'notify' );
	},
	////-----------------------------------------------------------------------------------------
	// Trigger templateHelper
	_compile: function( dirties ){
		return snew.templateHelper.compile(
			this.controller._meta.path,
			this.controller._meta.uid,
			this.controller.content,
			this._meta.currentValues,
			dirties,
			this.controller._meta.uid
		);
	},
	////-----------------------------------------------------------------------------------------
	// Triggers compilefunction but adds script-tags with uid
	_compileComplete: function(){
		var id = this.controller._meta.uid;
		return snew.viewHelper.scriptStart( id, this._meta.path ) + this._compile('*') + snew.viewHelper.scriptEnd( id );
	},
	////-----------------------------------------------------------------------------------------
	// Registers what keys got dirty
	_addDirty: function( key, type, value ) {
		if(!this._meta.dirty[key] || type === 'set') this._meta.dirty[key] = [];
		// @TODO add handling for pop/shift + push/unshift
		this._meta.dirty[key].push({type, value});
		snew.viewHelper.pushOnce('dirties', this.controller._meta.uid);
	},
	////-----------------------------------------------------------------------------------------
	// Works the dirties
	_handleDirties: function() {
		// @TODO this._meta.dirty needs grouping for unsift and push
		this._compile(this._meta.dirty);
		this._meta.dirty = {};
	},
	////-----------------------------------------------------------------------------------------
	// returns jquery object depending selector
	obj: function( path ){
		var selector = null;
		var id = this.controller._meta.uid;
		var startUid = snew.viewHelper.uidDomNode + '[' + snew.viewHelper.uidAttrStart + '=' + id + ']';
		var endUid   = snew.viewHelper.uidDomNode + '[' + snew.viewHelper.uidAttrEnd + '=' + id +']';
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
	if( snew.viewHelper.list[ path ] ){
		console.warn( 'The View for ' + path + ' already exists' );
	} else {
		snew.viewHelper.list[ path ] = snew.Obj( 'view', path, obj );
		snew.utilHelper.merge( snew.viewHelper.list[ path ], classContent );
	}
}

export default view;