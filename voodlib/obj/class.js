var util = require('voodkit/util/helper').default;

var defaults = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Flag if an internal registry should be used
		registry: false,
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'content'
	},
	////-----------------------------------------------------------------------------------------
	// default initfunction
	init: function(){},
	////-----------------------------------------------------------------------------------------
	// default destroyfunction, gets called before instance gets terminated
	// @TODO not yet implemented
	destroy: function(){},
	////-----------------------------------------------------------------------------------------
	// metafunction for getting content
	get: function( key, opt ){
		return this._handleData( 'get', key, null, opt );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for setting content, returns if value has changed and if it gets rendered
	set: function( key, value, opt ){
		return this._handleData( 'set', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// adds runloopjobs with including uid of the jobs, for removage if controller gets destroyed
	addJob: function( opt ){
		opt.uid = this._meta.uid;
		vood.utilRunloop.addJob(opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for setting content, returns if value has changed and if it gets rendered
	setAll: function(value, opt ){
		var key = this._meta.contentSpace;
		if( !opt ) opt = {};
		if( opt.contentSpace !== undefined ) {
			key = opt.contentSpace;
		}
		opt.contentSpace = false; // Needs to be done, to don't get a prefix, but set the complete content

		return this._handleData( 'set', key, value, opt );
	},

	////-----------------------------------------------------------------------------------------
	// metafunction for pushing content, only for arrays
	push: function( key, opt ){
		return this._handleData( 'push', key, null, opt );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for pushing content, return true when added to array, returns false when it was already added
	pushOnce: function( key, value, opt ){
		return this._handleData( 'pushOnce', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for pop index of an array/obj
	pop: function( key, value, opt ){
		return this._handleData( 'pop', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// handles all the events
	trigger: function( type, evt, opt ){
		return vood.viewHelper.trigger( type, evt, opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for handling data-operations
	_handleData: function( type, key, value, opt ){
		if(!opt) {opt = {};}
		key = this._generateRealpath( key, opt );
		return this._handleRealData( type, key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// Checks if this view has a fitting event-definition
	_checkForEvent: function( type, evt, opt ) {
		var result =  {found: false, result: null};
		for( var i = 0; i < this.events.length; i++) {
			var eventDefinition = this.events[ i ];
			if( vood.viewHelper.checkEventMatch( eventDefinition.type, type, evt )) {
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
				if( this.controller && _.isFunction( this.controller[ eventDefinition.action ] )) {
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
						result.result = this[ eventDefinition.action ]( evt );
					} else {
						result.result = this[ eventDefinition.action ]( data, evt, target );
						if(result.result === false) evt.propagation = false;
					}
				}
				if( !result.found ) console.error( 'Found an eventdefinition ' + type + ' but the corresponding action ' + eventDefinition.action + ' was not found' );
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// query management of data-handling
	_handleRealData: function( type, key, value, opt ){
		var keyParts  = key.split( '.' );
		var partClone = _.clone( keyParts );
		var result    = vood.objHelper.isQuery( key ) ? [] : undefined;

		// @TODO add to registry
		for( var i = 0; i < keyParts.length; i++ ){
			var part = keyParts[ i ];
			var previous = partClone.slice( 0, i );
			var lastKey  = previous[ previous.length - 1 ];

			if( vood.objHelper.isQuery( part )){
				var obj      = this._getReference( previous )[ lastKey ];
				if( _.isArray( obj )){
					for( var arrIndex = 0; arrIndex < obj.length; arrIndex++ ){
						if( vood.objHelper.isTrue( obj[ arrIndex ], part )){
							opt.addReg     = false;
							partClone[ i ] = arrIndex;
							result.push( this._handleRealData( type, partClone.join( '.' ), value, opt ));
						}
					}
				} else {
					var msg = keyParts.splice( 0, i ).join( '.' ) + ' is not an array';
					if( opt.exception === false ){
						console.warn( msg );
					} else {
						throw msg;
					}
				}
				return result;
			} else if( i + 1 == keyParts.length ){
				return this._handleTypes( type, keyParts, value, opt );
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// actual handling of the data (without queries)
	_handleTypes: function( type, keyParts, value, opt ){
		var changed = opt.forceRender || false;
		var result = false;
		switch (type){
			case 'get':
				result = this._getReference( keyParts )[ keyParts[ keyParts.length - 1 ]];
				break;
			case 'set':
				var current = this._getReference( keyParts )[ keyParts[ keyParts.length - 1 ]];
				if( current != value ){
					this._getReference( keyParts )[ keyParts[ keyParts.length - 1 ]] = value;
					result  = true;
					changed = true;
				}
				break;
			default:
				throw 'type ' + type + ' is not defined';
		}

		if( changed && this.view ){
			// Only rerender when its relevant to the template
			if( keyParts[ 0 ] === this._meta.contentSpace ){
				if( vood.viewHelper.dirtyHandling !== false ){
					this.view._meta.dirty = true;
				} else {
					this.view._render();
				}
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// handling of dotnotation, returns the last but one. creates objects if not existent
	_getReference: function( keyParts ){
		if(keyParts.length === 1) { // @FIXME whithout this hack, function returns null
			return this;
		} else {
			var content = this[ keyParts[ 0 ]];
			for( var i = 1; i < keyParts.length; i++ ){
				var part = keyParts[ i ];

				if( i == keyParts.length - 1 ){
					return content; // sadly i cant return the property-value itself, reference would get lost
				}

				if( !content[ part ] && i + 1 < keyParts.length ){ // @TODO Check for sideeffects -> === undefined was it before
					content[ part ] = {};
					content = content[ part ];
					console.info( keyParts.slice( 0, i + 1 ).join( '.' ) + ' did not exist, so I created it for you');
				} else {
					content = content[ part ];
				}
			}
		}
		
	},
	////-----------------------------------------------------------------------------------------
	// adds (optional) prefix to path
	_generateRealpath: function( key, opt ){
		if( opt.contentSpace === false ){
			return key;
		} else if( opt.contentSpace ){
			return opt.contentSpace + '.' + key;
		} else if( this._meta.contentSpace ){
			return this._meta.contentSpace + '.' + key;
		} else {
			return key;
		}
	},

};

var meta = function(){
	var obj = arguments[ arguments.length - 1 ];
	var properties = _.cloneDeep( defaults );
	util.merge( obj, properties );
	if( arguments.length > 1 ){
		obj._meta.type = arguments[ 0 ];
	}
	if( arguments.length > 2 ){
		obj._meta.path = arguments[ 1 ];
	}
	return obj;
};

export default meta;