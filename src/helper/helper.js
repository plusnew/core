import Obj from 'snew/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// returns helpers as an array, for better eventhandling at the viewhelper
	search: function() {
		var result = [];
		for( var i in app.helper ) {
			result.push( app.helper[ i ] );
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// gets called after the system startup, called by controllerHelper after all initial controller.model were loaded
	callInits: function() {
		var result = [];
		for( var i in app.helper ) {
			snew.utilHelper.safeCall( app.helper[ i ], 'init' );
		}
		return result;
	}

});