const classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Flag if an internal registry should be used
		registry: true,
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'content',
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'controller',
		////-----------------------------------------------------------------------------------------
		// holds all send requests and keeps there state
		requests: {}
	},
	////-----------------------------------------------------------------------------------------
	// Object which the template accesses
	content: {},
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered, this.content can be manipulated without consequences
	// Be careful when you trigger events, subcontroller/siblings will not be exitent
	construct() {},
	////-----------------------------------------------------------------------------------------
	// Gets triggered each time after the template got rerendered
	notify() {},
	////-----------------------------------------------------------------------------------------
	// Function to modify the modelresponse, e.g. merge current 
	// If you use that, be careful if this.content is an reference, than it would say "nothing changed, no render"
	preprocess(response) { return response; },
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	send(opt) {
		let id = snew.helperAdapter.send( opt );
		// opt is a reference and got a property named requestId from the adapter
		this._meta.requests[ id ] = opt;
		return id;
	},
	////-----------------------------------------------------------------------------------------
	// triggers the this._loadModel function to reload content
	fetch() {
		this._meta.modelFinished = false;
		this._meta.modelLoading = false;
		this._loadModel();
	},
	////-----------------------------------------------------------------------------------------
	// triggers the backend with the value set in this.model, when its not already in the loading process
	// returns wheather the process is running, or if there is nothing to do
	_loadModel() {
		if( this.model && !this._meta.modelFinished ){
			if(!this._meta.modelLoading) {
				this._meta.modelLoading = true;
				const model = this.model;
				this.send({model: model, success: '_modelSuccess', error: '_modelError' });
			}
			return true;
		} else {
			return false;
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if given requestId is associated with this controller instance
	_checkRequest(incomingId, result) {
		for( const requestId in this._meta.requests) {
			if( requestId == incomingId ) {
				const request = this._meta.requests[ requestId ];
				let func = request.success;
				if(result.error) {
					func = request.error;
				}
				this[ func ](result);
				delete this._meta.requests[ requestId ];
			}
		}

	},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	subscribe(opt) {
		return snew.utilAdapter.subscribe( opt );
	},
	////-----------------------------------------------------------------------------------------
	// handles this.model callback
	_modelSuccess(response) {
		this._meta.modelFinished = true;
		response = this.preprocess( response.result );
		if( _.isArray( response )){ // this.content should always be an object, thatfor i put arrays into this.content.values
			this.meta.key = 'values';
			console.info(
				`${this._meta.path} had an model which returned an array. Put it instead of content, to content.values`
			);
		}
		if( this.model.key ){ // Model-Value does not have to be on top-layer of this._meta.contentSpace
			this.set(this.model.key, response, this.model.opt);
		} else {
			this.setAll(response, this.model.opt);
		}

		// @TODO call render method of view, init should only be called after rendering
		snew.controllerHelper.callInits(); // Not really needed, but fastens things up
	},
	////-----------------------------------------------------------------------------------------
	// handles this.model errorcallback
	_modelError(response) {
		this._meta.modelFinished = true;
		this.set('error', true);
		this.set('message', response.result);
		snew.controllerHelper.callInits(); // Not really needed, but fastens things up
		console.warn(`${this._meta.path} got an error `, response);
	}
};

////-----------------------------------------------------------------------------------------
// Function for creating classes
function controller(path, obj) {
	if( snew.controllerHelper.list[ path ] ){
		console.warn(`The Controller for ${path} already exists`);
	} else {
		snew.controllerHelper.list[ path ] = snew.Obj( 'controller', path, obj );
		snew.controllerHelper.list[ path ]._meta.path = path;
		snew.utilHelper.merge(snew.controllerHelper.list[ path ], classContent);
	}
}

export default controller;