export default vood.Obj({
	////-----------------------------------------------------------------------------------------
	// checks if object fits the query
	// @TODO needs to be implemented
	isTrue: function( obj, query ){
		return true;
	},
	////-----------------------------------------------------------------------------------------
	// checks if the string is an query
	isQuery: function( key ){
		var res = false;
		if( key.indexOf( '=' ) !== -1 || key.indexOf( '@' ) !== -1 ){
			res = true;
		}
		return res;
	},
});