export default vood.Obj({
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, hen nothing fits, first operator will be used
	logicOperators: [{
		delimiter: '&&',
		defaultValue: true
	}, {
		delimiter: '||',
		defaultValue: false
	}],
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, so >= has to be in this array, before >
	types: ['==', '!=', '>=', '<=', '>', '<'],
	////-----------------------------------------------------------------------------------------
	// checks if object fits the query
	isTrue: function( obj, query, variables ){
		var type = this.getType(query);
		var result = type.defaultValue;
		var parts = query.split(type.delimiter);
		for( var partIndex = 0; partIndex < parts.length; partIndex++ ){
			var queryParts = this.getLogicParts(parts[ partIndex ]);
			if(!this.objCheck( obj, queryParts, variables )) {
				result = !result;
				break;
			}
		}
		return result;
	},
	objCheck: function( obj, query, variables ) {
		var result = null;
		// @TODO implement bool and int casting
		// @TODO implement >=
		// @TODO implement variables
		switch (query.type) {
			case '==':
				if( obj[ query.key ] == query.value ) {
					result = true;
				} else {
					result = false;
				}
				break;
			case '!=':
				if( obj[ query.key ] != query.value ) {
					result = true;
				} else {
					result = false;
				}
				break;
			default:
				throw "Type " + query[ 1 ] + ' is not yet implemented, please contact https://github.com/plusgut/vood/issues';
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// returns an array of the query elements, ['title', '==', 'value']
	getLogicParts: function(query) {
		var delimiter = null;
		for( var i = 0; i < this.types.length; i++ ){
			var type = this.types[ i ];
			if( query.indexOf( type ) != -1 ){
				var parts = query.split( type );
				if(parts.length != 2) throw 'Your logic operator was there mutliple times ' + query;
				return {key: parts[ 0 ], type: type, value: parts[ 1 ]};
			}
		}
		throw "Your logic operator was not available " + query;
	},
	////-----------------------------------------------------------------------------------------
	// decides wheather to use && or || and returns the defaultvalues of it
	getType: function(query) {
		var type = null;
		for( var i = this.logicOperators.length; i > 0; i-- ) {
			var logicOperator = this.logicOperators[ i - 1 ];
			// Checks if delimter occours, or if its the last checkable object (for setting default)
			if( query.indexOf(logicOperator.delimiter) != -1 || (i === 1 && !type )){
				if(type) throw "You can not use multiple types";
				type = logicOperator;
			}
		}
		return type;
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
	////-----------------------------------------------------------------------------------------
	// checks if the key is a sub, needed for registry removal if parent gets set
	isKeyChild: function( key, check ){
		return true;
	}
});