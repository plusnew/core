export default vood.Obj({
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, when nothing fits, first operator will be used
	logicOperators: [{
		delimiter: '&&',
		defaultValue: true
	}, {
		delimiter: '||',
		defaultValue: false
	}, {
		delimiter: '@each',
		defaultValue: true,
		skip: true
	}],
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, so >= has to be in this array, before >
	types: ['==', '!=', '>=', '<=', '>', '<'],
	////-----------------------------------------------------------------------------------------
	// checks if object fits the query
	isTrue: function( obj, query, variables ){
		var type = this.getType(query);
		var result = type.defaultValue;
		if(type.skip) return result;
		var parts = query.split(type.delimiter);
		for( var partIndex = 0; partIndex < parts.length; partIndex++ ){
			var queryParts = this.getLogicParts(parts[ partIndex ]);
			if(this.objCheck( obj, queryParts, variables ) != type.defaultValue) {
				result = !result;
				break;
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// Returns variables which are in the query {variableName}
	getVariableName: function( key ) {
		if( key[ 0 ] == '{' && key[ key.length - 1 ] == '}'){
			return key.slice( 1, key.length - 1 );
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if querypart fits to corresponding object, when variables are used it checks them as an array
	objCheck: function( obj, query, variables ) {
		var result = null;
		var variableName = this.getVariableName( query.value );
		var values = [query.value];
		if( variableName ){
			this.variableValidation( variableName, variables );
			values = variables[ variableName ];
		}
		for(var i = 0; i < values.length; i++) {
			var value = values[ i ];
			result = this.valueCompare( obj[ query.key ], value, query.type );
			if( result ) break;
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// compares two values depending on the logicoperator-type
	valueCompare: function( source, target, type ) {
		var result = null;
		switch( type ){
			case '==':
				if( source === target ) result = true;
				else result = false;
				break;
			case '!=':
				if( source !== target ) result = true;
				else result = false;
				break;
			case '>=':
				if( source >= target ) result = true;
				else result = false;
				break;
			case '<=':
				if( source <= target ) result = true;
				else result = false;
				break;
			case '>':
				if( source > target ) result = true;
				else result = false;
				break;
			case '<':
				if( source < target ) result = true;
				else result = false;
				break;
			default:
				throw "Type " + type + ' is not implemented, please contact https://github.com/plusgut/vood/issues';
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
		if( key.indexOf( '=' ) !== -1 || key.indexOf( '@' ) !== -1 ){
			return true;
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks if all necessary values are correct
	variableValidation: function( key, variables ){
		if(!variables || variables[ key ] === undefined) throw key + ' was not set in opt: {query: {}}';
		if( !_.isArray( variables[ key ])) throw key + ' query has to be an array';
	},
	////-----------------------------------------------------------------------------------------
	// checks if the key is a sub, needed for registry removal if parent gets set
	// @TODO
	isKeyChild: function( key, check ){
		return true;
	}
});