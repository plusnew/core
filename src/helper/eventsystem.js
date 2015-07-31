import Obj from 'vood/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// Needed for validation warnings
	_eventParts: [ 'action', 'type' ],
	////-----------------------------------------------------------------------------------------
	// Handles the triggering of the events
	triggerEvent: function( namespace, ...data ){
		console.log(...data);
	},
	////-----------------------------------------------------------------------------------------
	// Handles the internal registry for events
	addEvent: function( evt, id, namespace ){

	},
	//
	////-----------------------------------------------------------------------------------------
	// Checks validation of the events
	validateEvent: function(evt, context) {
		var valid  = true;
		var length = 0;
		for(var index in evt) {
			if(evt.hasOwnProperty(index)) {
				if(this._eventParts.indexOf(index) === -1) {
					console.warn(context._meta.namespace + ' | \tThe event has some unknown options (' + index + ')', evt, context);
				} else {
					length++;
					if(index === 'action' && !context[evt[index]]) {
						valid = false;
						console.error( context._meta.namespace + ' | \tThe given action ('+evt[index] + ') does not exist in the class' );
					}
				}
			}
		}

		return valid && length === this._eventParts.length ? true : false;
	}
});