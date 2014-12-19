////-----------------------------------------------------------------------------------------
// Uppercases the first letter of an string

String.prototype.capitalize = function(){
	return this[0].toUpperCase() + this.slice(1, this.length);
};

var obj = {
	////-----------------------------------------------------------------------------------------
	// Merges an object inside an other, without overwriting
	merge: function( target, obj ){
		for( var index in obj ){
				if( obj.hasOwnProperty( index )){
					if( !target[ index ] ){
						target[ index ] = obj[ index ];
					} else if( _.isObject( target[ index ] ) && _.isObject( obj[ index ] ) && !_.isFunction( target[ index ] ) && !_.isFunction( obj[ index] )){
						this.merge( target[ index ], obj[ index ] );
					}
				}
			}
	},
	////-----------------------------------------------------------------------------------------
	// inserts text inside a string at position
	insertAt: function( src, position, str ){
		return src.substr( 0, position ) + str + src.substr( position );
	},
	////-----------------------------------------------------------------------------------------
	// Triggers e.g. init-functions, without breaking stuff. on debug mode it throws the errors
	safeCall: function( scope, func, args ){
		// @TODO add arguments
		if(app.debug){
			scope[ func ]();
		} else {
			try {
				scope[ func ]();
			} catch( err ){
				console.error( err );
			}
		}
	}
};

export default window.vood ? vood.Obj( obj ) : obj;