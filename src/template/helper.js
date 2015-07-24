import Obj from 'vood/obj/class';

export default Obj({
	//// ------------------------------------------------------------
	// Existing templates collection
	list: {},
	//// ------------------------------------------------------------
	// Layer for comunnicate with tempart
	compile: function( path, uid, content, currentValues, dirties ){
		if( !this.list[ path ] ){
			throw 'Template does not exist';
		} else {
			return tempartCompiler.compile( this.list[ path ], content, currentValues, dirties );
		}
	}
});