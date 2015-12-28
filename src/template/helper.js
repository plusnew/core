import Obj from 'snew/obj/class';

export default Obj({
	//// ------------------------------------------------------------
	// Existing templates collection
	list: {},
	init() {
		tempartCompiler.trigger = this.triggerEvent.bind(this);
	},
	triggerEvent: function(componentId, action, parameter) {
		const controllers = snew.search(componentId);
		for( let i = 0; i < controllers.length; i++) {
			let controller = controllers[ i ];
			let found = false;
			if(controller[ action ]) {
				found = true;
				controller[ action ].apply( controller, parameter );
			}
			if( controller.view[ action ] ) {
				found = true;
				controller.view[action].apply( controller.view, parameter );
			}
			if(!found) {
				throw 'Could not matching event(' + action + ') to controller(' + controller._meta.path +')';
			}
		}
	},
	//// ------------------------------------------------------------
	// Layer for comunnicate with tempart
	compile(path, uid, content, currentValues, dirties, prefix) {
		if( this.list[ path ] ){
			return tempartCompiler.compile({
				blocks: this.list[ path ],
				content: content,
				currentValues: currentValues,
				dirties: dirties,
				path: path,
				prefix: prefix
			});
		} else {
			throw `Template ${path} does not exist`;
		}
	},
	//// ------------------------------------------------------------
	// Layer for comunnicate with tempart
	getDependency(path, blockId, type) {
		let blocks = this.list[ path ];
		const parts  = blockId.split( '-' );
		let block  = null;
		// @TODO implement it working for loops
		for( let i = 0; i < parts.length; i++ ){
			for( let blockIndex = 0; blockIndex < blocks.length; blockIndex++ ){
				if( blocks[ blockIndex].id ==  parts[ i ]){
					if( i + 1 < parts.length) {
						blocks = blocks[ parts[ i ]].contains;
					} else {
						block = blocks[ blockIndex ];
					}
					break;
				}
			}
		}

		if(block.type !== 'dom') throw 'Something went wrong here!';
		for( let orderIndex = 0; orderIndex < block.order.length; orderIndex++ ){
			if( block.order[ orderIndex ] == type ){
				return block.contains[ orderIndex ];
			}
		}
		console.error(' Couldnt update your value, seems like no one cares');
	}
});