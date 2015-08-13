import Obj from 'vood/obj/class';

export default Obj({
	//// ------------------------------------------------------------
	// Existing templates collection
	list: {},
	//// ------------------------------------------------------------
	// Layer for comunnicate with tempart
	compile: function( path, uid, content, currentValues, dirties, prefix ){
		if( this.list[ path ] ){
			return tempartCompiler.compile( this.list[ path ], content, currentValues, dirties, path, prefix );
		} else {
			throw 'Template ' + path + ' does not exist';
		}
	}
});