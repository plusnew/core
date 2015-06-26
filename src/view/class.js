
var classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'view',
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'controller.content',
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
		this._meta.dirty = false;
		var startUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrStart + '=' + this.controller._meta.uid + ']';
		var begin    = $( startUid );
		// @TODO remove subcontrollers
		while( this.obj( 'root' ).length > 1 ){
			this.obj( 'root' ).last().remove(); // I want only one object to get replaced, else its possible to have the content dubled
		}
		if( this.obj( 'root').length=== 0 && begin.length === 1) { // Needed, if the template had nothing to return previously
			begin.after('<span></span>'); // We shortly add a span to have an entrance point
		}
		this.obj( 'root').replaceWith( this._compile() );
		vood.utilHelper.safeCall( this.controller, 'notify' );
		vood.utilHelper.safeCall( this, 'notify' );
	},
	////-----------------------------------------------------------------------------------------
	// Trigger jade compiler
	_compile: function(){
		return vood.viewHelper.compile( this.controller._meta.path, this.controller.content );
	},
	////-----------------------------------------------------------------------------------------
	// Triggers compilefunction but adds script-tags with uid
	_compileComplete: function(){
		var id = this.controller._meta.uid;
		return vood.viewHelper.scriptStart( id, this._meta.path ) + this._compile() + vood.viewHelper.scriptEnd( id );
	},
	////-----------------------------------------------------------------------------------------
	// returns jquery object depending selector
	obj: function( path ){
		var selector = null;
		var id = this.controller._meta.uid;
		var startUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrStart + '=' + id + ']';
		var endUid   = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrEnd + '=' + id +']';
		var root = $( startUid ).nextUntil( endUid);
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