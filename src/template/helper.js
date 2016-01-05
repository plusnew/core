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
	// Layer for comunnicate with tempart, to sync values
	syncModel(path, blockId, type, value, currentValues) {
		let blocks = this.list[ path ];
		const parts  = blockId.split( '-' );
		let blocksList = [];
		for( let i = 0; i < parts.length; i++ ){
			for( let blockIndex = 0; blockIndex < blocks.length; blockIndex++ ){
				const block      = blocks[ blockIndex ];
				const blockParts = parts[ i ].split( ':' );
				const blockId    = blockParts[ 0 ];

				if( block.id == blockId ){
					var currentValue  = null
					if( blockParts[ 1 ] ) {
						currentValue = currentValues[ blockId ];
					}
					blocksList.push({block: block, local: blockParts[ 1 ], id: blockParts[ 0 ], currentValues: currentValue}); // @TODO add currentValues
					if( i + 1 < parts.length) {
						blocks = block[ currentValues[ block.id ].type ];
					} else {
						if(block.type !== 'dom') throw 'Something went wrong here!';
						// @TODO add updating of currentValues in block.dom
						for( let orderIndex = 0; orderIndex < block.order.length; orderIndex++ ){
							if( block.order[ orderIndex ] == type ){
								return this.generateRealKey(block.contains[orderIndex].depending[0], blocksList);
							}
						}
					}
					if( blockParts[ 1 ] ){
						currentValues = currentValues[ blockId ].values[ blockParts[ 1 ]];
					}
					break;
				}
			}
		}
		console.error(' Couldnt update your value, seems like no one cares');
	},
	//// ------------------------------------------------------------
	// In template can happen renamings, eg in loops this has to be reversed
	generateRealKey(source, blocks) {
		var key = source.split('.');
		for(var i = 0; i < blocks.length; i++) {
			if(blocks[ i ].local) {
				var blockEntity = blocks[ i ];
				var pos = blockEntity.currentValues.order.indexOf(blocks[i].local);

				if( pos === -1 ) throw 'Generating arrayposition of hash did not work'
				if( blockEntity.block.depending[ blockEntity.block.depending.length - 1 ] === key[ 0 ] ){
					key.shift();
					key.unshift(pos);
					key.unshift(blockEntity.block.depending[ 0 ]);
				}
			}
		}
		return key;
	}
});