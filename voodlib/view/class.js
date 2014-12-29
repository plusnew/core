
var classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'view'
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
	// Checks if this view has a fitting event-definition
	_checkForEvent: function( type, evt, opt ) {
		var result =  {found: false, result: null};
		for( var i = 0; i < this.events.length; i++) {
			var eventDefinition = this.events[ i ];
			
			if(eventDefinition.type == type) {
				// If not an pseudo-event selector has to fit
				var target = null;
				if( !opt.pseudo) {
					var parents =  $( evt.target ).parents( eventDefinition.selector );
					if( $( evt.target ).is( eventDefinition.selector )){
						target = $( evt.target );
					} else if( parents.length ){
						target = parents;
					} else {
						continue;
					}
				}
				var data = vood.viewHelper.getAttributes( target );
				// Sorry for doubled code
				if( _.isFunction( this.controller[ eventDefinition.action ] )) {
					result.found = true;
					if( opt.pseudo ) {
						result.result = this.controller[ eventDefinition.action ]( evt );
					} else {
						result.result = this.controller[ eventDefinition.action ]( data, evt, target );
						if(result.result === false) evt.propagation = false;
					}
				}
				if( _.isFunction( this[ eventDefinition.action ] )) {
					result.found = true;
					if( opt.pseudo ) {
						result.result = this.controller[ eventDefinition.action ]( evt );
					} else {
						result.result = this.controller[ eventDefinition.action ]( data, evt, target );
						if(result.result === false) evt.propagation = false;
					}
				}
				if( !result.found ) console.error( 'Found an eventdefinition ' + type + ' but the corresponding action ' + eventDefinition.action + ' was not found' );
			}
		}
		return result;
	},
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
		return vood.viewHelper.scriptStart( id ) + this._compile() + vood.viewHelper.scriptEnd( id );
	},
	////-----------------------------------------------------------------------------------------
	// returns jquery object depending selector
	obj: function( path ){
		var selector = null;
		var id = this.controller._meta.uid;
		var startUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrStart + '=' + id + ']';
		var endUid   = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrEnd + '=' + id +']';
		if( path !== 'root' ){
			if( !this[ path ] ){
				throw 'Couldnt get you the obj because of missing definition';
			}
			selector = this[ path ];
		}
		return $( startUid ).nextUntil( endUid, selector );
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