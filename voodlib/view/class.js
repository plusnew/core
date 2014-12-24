var classContent = {
	_meta: {
		type: 'view'
	},
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered
	construct: function(){},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_render: function(){
		this._meta.dirty = false;
		while( this.obj( 'root' ).length > 1 ){
			this.obj( 'root' ).last().remove(); // I want only one object to get replaced, else its possible to have the content dubled
		}
		this.obj( 'root' ).replaceWith( this._compile() );
	},
	////-----------------------------------------------------------------------------------------
	// Trigger jade compiler
	_compile: function(){
		return vood.viewHelper.compileJade( this.controller._meta.path, this.controller.content );
	},
	////-----------------------------------------------------------------------------------------
	// Triggers compilefunction but adds script-tags with uid
	_compileComplete: function(){
		var id = this.controller._meta.uid;
		return vood.viewHelper.scriptStart( id ) + this._compile() + vood.viewHelper.scriptEnd( id );
	},
	////-----------------------------------------------------------------------------------------
	// returns jquery object depending selector
	obj: function( path ){
		var selector = null;
		var id = this.controller._meta.uid;
		if( path !== 'root' ){
			if( !this[ path ]){
				throw 'Couldnt get you the obj because of missing definition';
			}
			selector = this[ path ];
		}
		return $( 'script[' + vood.viewHelper.uidAttrStart + '=' + id + ']' ).nextUntil( 'script[' + vood.viewHelper.uidAttrEnd + '=' + id +']', selector );
	}
};

function view( path, obj ){
	vood.viewHelper.list[ path ] = vood.Obj( 'view', path, obj );
	vood.utilHelper.merge( vood.viewHelper.list[ path ], classContent );
}

export default view;