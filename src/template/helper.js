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
		// when on a click something gets destroyed, before a second click dom should be synced
		snew.viewHelper.dirtyChecking(); 
	},
	//// ------------------------------------------------------------
	// Layer for comunnicate with tempart
	compile(path, uid, content, currentValues, dirties, prefix, controller) {
		if( this.list[ path ] ){
			return tempartCompiler.compile({
				controller: controller,
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
		if(!this.list[path]) throw 'No such template found';
		return tempartCompiler.syncModel(this.list[path], blockId, type, value, currentValues);
	}
});