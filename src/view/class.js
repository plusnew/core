const classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'view',
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'controller.content',
		////-----------------------------------------------------------------------------------------
		// current values for checking context
		currentValues: {},
		////-----------------------------------------------------------------------------------------
		// Keeps in mind what keys did get dirty, to only change that
		dirty: []
	},
	////-----------------------------------------------------------------------------------------
	// array of eventdefinitions
	events: [],
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered
	construct() {},
	////-----------------------------------------------------------------------------------------
	// Gets triggered each time after the template got rerendered
	notify() {},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_triggerEvent(func, data, event, target) {

	},
	////-----------------------------------------------------------------------------------------
	// updates the currentValue of the specified attribute/value
	_updateCurrent(blockId, attribute, value) {
		const attributeBlock = snew.templateHelper.getDependency( this._meta.path, blockId, attribute );
		const block = this._searchBlock( blockId, attributeBlock.id, value );
		for( let i = 0; i < attributeBlock.depending.length; i++ ){
			this.controller.set(attributeBlock.depending[ i ], value);
		}
	},

	_searchBlock(blockId, attributeId, value) {
		const parts  = blockId.split( '-' );
		let blocks = this._meta.currentValues;
		const block  = null;
		// @TODO implement it working for loops
		for( let i = 0; i < parts.length; i++ ){
			blocks = blocks[ parts[ i ]];
			blocks[attributeId] = value;
		}
	},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_render() {
		this._compile(this._meta.dirty);
		this._meta.dirty = []; // We dont want to rererender, because the state is clean

		snew.utilHelper.safeCall(this.controller, 'notify');
		snew.utilHelper.safeCall(this, 'notify');
	},
	////-----------------------------------------------------------------------------------------
	// Trigger templateHelper
	_compile(dirties) {
		return snew.templateHelper.compile(
			this.controller._meta.path,
			this.controller._meta.uid,
			this.controller.content,
			this._meta.currentValues,
			dirties,
			this.controller._meta.uid
		);
	},
	////-----------------------------------------------------------------------------------------
	// Triggers compilefunction but adds script-tags with uid
	_compileComplete() {
		const id = this.controller._meta.uid;
		return snew.viewHelper.scriptStart( id, this._meta.path ) + this._compile('*') + snew.viewHelper.scriptEnd( id );
	},
	////-----------------------------------------------------------------------------------------
	// Registers what keys got dirty
	_addDirty(key, type, value) {
		// @TODO add handling for type === set, it has to overwrite all previous shift/push/set/remove and its children
		this._meta.dirty.push({type, value, key});
		snew.viewHelper.pushOnce('dirties', this.controller._meta.uid);
	},
	////-----------------------------------------------------------------------------------------
	// Works the dirties
	_handleDirties() {
		// @TODO this._meta.dirty needs batching
		this._compile(this._batchDirties(this._meta.dirty));
		this._meta.dirty = [];
	},
	////-----------------------------------------------------------------------------------------
	// batches dirties to this form
	// @TODO
	// dirties: [
	// 	{op: 'insert',          to: 0, key: ['todos'], values: []},
	// 	{op: 'update',          to: 1, key: ['todos'], value:  []}
	// 	{op: 'move',   from: 4, to: 3, key: ['todos']},
	// 	{op: 'remove', from: 4,        key: ['todos']}
	// ]
	_batchDirties(dirties) {
		return dirties
	}
};

////-----------------------------------------------------------------------------------------
// Function for creating classes
function view(path, obj) {
	if( snew.viewHelper.list[ path ] ){
		console.warn(`The View for ${path} already exists`);
	} else {
		snew.viewHelper.list[ path ] = snew.Obj( 'view', path, obj );
		snew.utilHelper.merge(snew.viewHelper.list[ path ], classContent);
	}
}

export default view;