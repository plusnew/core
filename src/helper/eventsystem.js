import Obj from 'snew/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// Holds the information what instances are registered
	_list: {},
	////-----------------------------------------------------------------------------------------
	// Needed for validation warnings
	_eventParts: [ 'action', 'type' ],
	////-----------------------------------------------------------------------------------------
	// Init registers itself to creation of controllers/helpers
	init: function() {
		snew.controllerHelper._addRegister('eventsystem', '_addEvents');
		// snew.helperHelper._register('eventsystem', '_addEvents'); // @TODO
	},
	////-----------------------------------------------------------------------------------------
	// Handles the triggering of the events
	trigger: function( type, ids, args ){
		// @TODO improve, this doesn't look performative
		var result = [];
		if( this._list[ type ] ){
			for(var namespace in this._list[ type ]){
				for(var id in this._list[ type ][ namespace ]) {
					var events   = this._list[ type ][ namespace ][ id ];
					var instances = snew[namespace + 'Helper'].search(id);
					for(var instanceIndex = 0; instanceIndex < instances.length; instanceIndex++ ){
						var instance = instances[ instanceIndex ];
						for( var i = 0; i < events.length; i++ ){
							var evt = events[ i ];
							if(instance[ evt.action ]) {
								result.push(instance[ evt.action ]( type, ...args ));
							} else {
								console.error( 'The ' + namespace + ' does not have the function ' + evt.action, id );
							}
						}
					}
				}
			}
		}
		if( !result.length ){
			console.warn( 'There was no eventdefinition found ' + type );
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// Checks if instance has an events array
	_addEvents: function( instance, type ){
		if( instance.events ){
			for( var i = 0; i < instance.events.length; i++ ){
				this.addEvent( instance.events[i], instance._meta.uid, type );
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Handles the internal registry for events
	addEvent: function( evt, id, namespace ){
		if( !this._list[ evt.type ])					this._list[ evt.type ] = {};
		if( !this._list[ evt.type ][ namespace ])		this._list[ evt.type ][namespace] = {};
		if( !this._list[ evt.type ][ namespace ][id])	this._list[ evt.type ][namespace][id] = [];
		this._list[ evt.type ][ namespace ][ id ].push( evt );
	},
	//
	////-----------------------------------------------------------------------------------------
	// Checks validation of the events
	validateEvent: function(evt, context) {
		var valid  = true;
		var length = 0;
		for( var index in evt ){
			if(evt.hasOwnProperty(index)) {
				if( this._eventParts.indexOf( index ) === -1 ){
					console.warn(context._meta.namespace + ' | \tThe event has some unknown options (' + index + ')', evt, context);
				} else {
					length++;
					if( index === 'action' && !context[ evt[ index ]]){
						valid = false;
						console.error( context._meta.namespace + ' | \tThe given action ('+evt[index] + ') does not exist in the class' );
					}
				}
			}
		}

		return valid && length === this._eventParts.length ? true : false;
	}
});