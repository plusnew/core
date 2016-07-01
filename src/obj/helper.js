import Obj from 'snew/obj/class';
import util from 'snew/helper/util';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, when nothing fits, first operator will be used
	logicOperators: {
		and: {
			delimiter: '&&',
			defaultValue: true
		},
		or: {
			delimiter: '||',
			defaultValue: false
		},
		wildcard: {
			delimiter: '@each',
			defaultValue: true,
			skip: true
		}
	},
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, so >= has to be in this array, before >
	types: ['==', '!=', '>=', '<=', '>', '<'],
	////-----------------------------------------------------------------------------------------
	// checks if object fits the query
	isTrue(obj, query, opt) {
		const type = this.getType(query);
		let result = type.defaultValue;
		if(type.skip) return result;
		for(var queryIndex in query) {
			if( query.hasOwnProperty(queryIndex) && this.objCheck( obj[queryIndex], query[queryIndex], '==' ) != type.defaultValue ){
				result = !result;
				break;
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// Checks if querypart fits to corresponding object, when variables are used it checks them as an array
	objCheck(source, target, operator) {
		//@TODO Currently not useful - will check multiple values in the future - only simple queries will work
		return this.valueCompare(source, target, operator);
	},
	////-----------------------------------------------------------------------------------------
	// compares two values depending on the logicoperator-type
	valueCompare(source, target, type) {
		let result = null;
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
				throw `Type ${type} is not implemented, please contact https://github.com/plusgut/snew/issues`;
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// returns an object of query elements {key: key: type: '==', value: value}
	// @deprecated
	getLogicParts(query) {
		for( let i = 0; i < this.types.length; i++ ){
			const type = this.types[ i ];
			if( query.indexOf( type ) != -1 ){
				const parts = query.split( type );
				if( parts.length != 2 ) throw `Your logic operator was there mutliple times ${query}`;
				return {key: parts[ 0 ], type: type, value: parts[ 1 ]};
			}
		}
		throw `Your logic operator was not available ${query}`;
	},
	////-----------------------------------------------------------------------------------------
	// decides wheather to use && or || and returns the defaultvalues of it
	// @deprecated
	getType(query) {
		if(util.isObject(query)) {
			return this.logicOperators.and;
		} else if(util.isArray(query)) {
			return this.logicOperators.and;
		}

		throw "Unknown type, unsure how you got here..";
	},
	////-----------------------------------------------------------------------------------------
	// iterates threw all keyparts
	hasQuery(keyParts) {
		for(let i = 0; i < keyParts.length; i++) {
			if(this.isQuery(keyParts[i])) {
				return true;
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks if the string is an query
	isQuery(keyNode) {
		if( typeof keyNode === 'object' ){
			return true;
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks if the key is a sub, needed for registry removal if parent gets set
	// @TODO
	isKeyChild(key, check) {
		return true;
	}
});