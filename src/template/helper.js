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
	},
	//// ------------------------------------------------------------
	// Layer for comunnicate with tempart
	getDependency: function( path, blockId, type ) {
		var blocks = this.list[ path ];
		var parts  = blockId.split( '-' );
		var block  = null;
		// @TODO implement it working for loops
		for( var i = 0; i < parts.length; i++ ){
			console.log(parts[ i ]);
			for( var blockIndex = 0; blockIndex < blocks.length; blockIndex++ ){
				if( blocks[ blockIndex].id ==  parts[ i ]){
					if( i + 1 < parts.length) {
						blocks = blocks[ parts[ i ]].contains;
					} else {
						block  = blocks[ blockIndex ];
					}
					break;
				}
			}
		}

		if(block.type !== 'bindAttr') throw 'Something went wrong here!';
		for( var orderIndex = 0; i < block.order.length; i++ ){
			if( block.order[ orderIndex ] == type ){
				return block.contains[ orderIndex ];
			}
		}
		console.error( ' Couldnt update your value, seems like no one cares');
	}
});