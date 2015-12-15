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
	init() {
		snew.controllerHelper._addRegister('eventsystem', '_addEvents');
		// snew.helperHelper._register('eventsystem', '_addEvents'); // @TODO
	},
	////-----------------------------------------------------------------------------------------
	// Handles the triggering of the events
	trigger(type, ids, args) {
		// @TODO improve, this doesn't look performative
		const result = [];
		if( this._list[ type ] ){
			for(let namespace in this._list[ type ]){
				for(let id in this._list[ type ][ namespace ]) {
					const events   = this._list[ type ][ namespace ][ id ];
					const instances = snew[`${namespace}Helper`].search(id);
					for(let instanceIndex = 0; instanceIndex < instances.length; instanceIndex++ ){
						const instance = instances[ instanceIndex ];
						for( let i = 0; i < events.length; i++ ){
							const evt = events[ i ];
							if(instance[ evt.action ]) {
								result.push(instance[ evt.action ]( type, ...args ));
							} else {
								console.error(`The ${namespace} does not have the function ${evt.action}`, id);
							}
						}
					}
				}
			}
		}
		if( !result.length ){
			console.warn(`There was no eventdefinition found ${type}`);
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// Checks if instance has an events array
	_addEvents(instance, type) {
		if( instance.events ){
			for( let i = 0; i < instance.events.length; i++ ){
				this.addEvent(instance.events[i], instance._meta.uid, type);
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Handles the internal registry for events
	addEvent(evt, id, namespace) {
		if( !this._list[ evt.type ])					this._list[ evt.type ] = {};
		if( !this._list[ evt.type ][ namespace ])		this._list[ evt.type ][namespace] = {};
		if( !this._list[ evt.type ][ namespace ][id])	this._list[ evt.type ][namespace][id] = [];
		this._list[ evt.type ][ namespace ][ id ].push(evt);
	},
	//
	////-----------------------------------------------------------------------------------------
	// Checks validation of the events
	validateEvent(evt, context) {
		let valid  = true;
		let length = 0;
		for( const index in evt ){
			if(evt.hasOwnProperty(index)) {
				if( this._eventParts.indexOf( index ) === -1 ){
					console.warn(
                        `${context._meta.namespace} | 	The event has some unknown options (${index})`,
                        evt,
                        context
                    );
				} else {
					length++;
					if( index === 'action' && !context[ evt[ index ]]){
						valid = false;
						console.error(
                            `${context._meta.namespace} | 	The given action (${evt[index]}) does not exist in the class`
                        );
					}
				}
			}
		}

		return valid && length === this._eventParts.length ? true : false;
	}
});