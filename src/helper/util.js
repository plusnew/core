////-----------------------------------------------------------------------------------------
// Uppercases the first letter of an string
String.prototype.capitalize = function() {
	return this[ 0 ].toUpperCase() + this.slice( 1, this.length );
};

const obj = {
	////-----------------------------------------------------------------------------------------
	// Merges an object inside an other, without overwriting
	merge(target, obj) {
		for( let index in obj ){
				if( obj.hasOwnProperty( index )){
					if( !target[ index ] ){
						target[ index ] = obj[ index ];
					} else if( typeof target[ index ] === 'object' && typeof obj[ index ] === 'object' && !this.isFunction( target[ index ]) && !this.isFunction( obj[ index] )){
						this.merge(target[ index ], obj[ index ]);
					}
				}
			}
	},
	////-----------------------------------------------------------------------------------------
	// Most efficient way of checking for a function
	isFunction(obj) {
		return !!(obj && obj.constructor && obj.call && obj.apply);
	},
	////-----------------------------------------------------------------------------------------
	// checks if two values are the same
	isEqual(a, b) {
		// @FIXME thats not a good way
		return JSON.stringify(a) === JSON.stringify(b);
	},
	////-----------------------------------------------------------------------------------------
	// Adds an value to a specific position inside an array and returns that
	arrayInsertAt(arr, obj, pos) {
		// @TODO check if there is a better way, without instanciating new arrays
		var result = arr.slice(0, pos - 1);
		result.push(obj);
		return result.concat(arr.slice(pos - 1, arr.length));
	},
	////-----------------------------------------------------------------------------------------
	// Merges an object inside an other, without overwriting
	clone(source) {
		if( !( source instanceof Object) || this.isFunction( source )) { // Only objects are references
			return source;
		}
		let target = new source.constructor(); // @FIXME doesnt work for Date yet
		// Clone each property.
		for( let index in source) { // @FIXME I believe this breaks in ie8 for arrays
			target[ index ] = this.clone( source[ index ]);
		}
		return target;
	},
	////-----------------------------------------------------------------------------------------
	// Triggers e.g. init-functions, without breaking stuff. on debug mode it throws the errors
	safeCall(scope, func, args) {
		if(!args) args = [];
		if(app.debug){
			return scope[ func ]( args[0], args[1], args[2], args[3] ); // @TODO make this dynamic without eval
		} else {
			try {
				return scope[ func ]( args[0], args[1], args[2], args[3] ); // @TODO make this dynamic without eval
			} catch( err ){
				console.error(err);
			}
		}
	},
};

export default window.snew ? snew.Obj( obj ) : obj;