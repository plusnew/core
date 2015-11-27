////-----------------------------------------------------------------------------------------
// Uppercases the first letter of an string
String.prototype.capitalize = function(){
	return this[ 0 ].toUpperCase() + this.slice( 1, this.length );
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
		if(!args) args = [];
		if(app.debug){
			return scope[ func ]( args[0], args[1], args[2], args[3] ); // @TODO make this dynamic without eval
		} else {
			try {
				return scope[ func ]( args[0], args[1], args[2], args[3] ); // @TODO make this dynamic without eval
			} catch( err ){
				console.error( err );
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// If you don't like slashes inside the namespace/module pattern, you can make your transition here
	transformNamespace: function( name ){
		return name;
	}
};

export default window.snew ? snew.Obj( obj ) : obj;