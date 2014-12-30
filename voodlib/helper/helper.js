export default vood.Obj({
	get: function() {
		var result = [];
		for( var i in app.helper ) {
			result.push( app.helper[ i ] );
		}
		return result;
	},
	callInits: function() {
		var result = [];
		for( var i in app.helper ) {
			vood.utilHelper.safeCall( app.helper[ i ], 'init' );
		}
		return result;
	}

});