const classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'view',
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: ['controller', 'content'],
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
		const key = snew.templateHelper.syncModel( this._meta.path, blockId, attribute, value, this._meta.currentValues );
		if(key) { // Not always is something to do
			this.controller.set(key, value);
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
	// dirties: [
	//	{type: 'create', to: 0, values: [], key: ['todos']},
	//	{type: 'update',        value:  {}, key: ['todos', 1, 'foobar']}
	//	{type: 'move',   to: 3,             key: ['todos', 4]},
	//	{type: 'delete',                    key: ['todos', 4]}
	// ]
	_batchDirties(dirties) {
		let result = []; // Gets filled by compress, not the most beautiful way..
		for( let i = 0; i < dirties.length; i++ ){
			const dirty = dirties[ i ];
			if(dirty.type == 'set') {
				this._compress(dirty, result, this.get(dirty.key).length - 1, dirty.value);
			} else if(dirty.type === 'push') {
				// The minus one is needed because the push already happened in the data (but not in the dom)
				// @FIXME? length is not always correct, it can have mutliple already added data-values
				this._compress(dirty, result, this.get(dirty.key).length - 1, dirty.value);
			} else if(dirty.type === 'shift') {
				this._compress(dirty, result, 0, dirty.value);
			} else if(dirty.type === 'remove') {
				
			} else {
				throw 'Unknown dataoperation, could not compile template';
			}
		}
		return result;
	},
	_compress(dirty, batch, position, value) {
		const dirtyType = snew.viewHelper.getCompressType(dirty.type);
		let preventCreation = false;
		for(let i = 0; i < batch.length; i++) {
			let same = true;
			for(let batchKeyIndex = 0; batchKeyIndex < batch[i].key.length; batchKeyIndex++) {
				if(batch[i].key[batchKeyIndex] !== dirty.key[i]) {
					same = false;
					break;
				}
			}

			if(same) {
				if(dirtyType === 'create') {
					if(batch[i].length !== dirty.key.length) {
						preventCreation = true;
					} else if(batch[i].to >= position && position <= batch[i].to + batch[i].values.length) {
						batch[i].values = snew.utilHelper.arrayInsertAt(batch[i].values, value, position);
						preventCreation = true;
					}
				} else if (dirtyType === 'set'){
					// preventCreation = true; // @TODO not tested
				} else {
					throw 'Unknown dirtyType ' + dirtyType;
				}
			}
		}
		if(!preventCreation) {
			batch.push({type: dirtyType, key: dirty.key, values: [dirty.value], to: position});
		}

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