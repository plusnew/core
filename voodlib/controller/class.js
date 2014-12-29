var classContent = {
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
	construct: function(){},
	////-----------------------------------------------------------------------------------------
	// Gets triggered each time after the template got rerendered
	notify: function() {},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	send: function( opt ){
		var id = vood.helperAdapter.send( opt );
		// opt is a reference and got a property named requestId from the adapter
		this._meta.requests[ id ] = opt;
		return id;
	},
	////-----------------------------------------------------------------------------------------
	// triggers the this._loadModel function to reload content
	fetch: function() {
		this._meta.modelFinished = false;
		this._meta.modelLoading  = false;
		this._loadModel();
	},
	////-----------------------------------------------------------------------------------------
	// triggers the backend with the value set in this.model, when its not already in the loading process
	// returns wheather the process is running, or if there is nothing to do
	_loadModel: function() {
		if( this.model && !this._meta.modelFinished ){
			if(!this._meta.modelLoading) {
				this._meta.modelLoading = true;
				this.set( 'loading', true ); // Only used for templates which want to show a waitloader or something similar
				var model = this.model;
				this.send( {model: model, success: '_modelSuccess', error: '_modelError' } );
			}
			return true;
		} else {
			return false;
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if given requestId is associated with this controller instance
	_checkRequest: function( incomingId, result ) {
		for( var requestId in this._meta.requests) {
			if( requestId == incomingId ) {
				var request = this._meta.requests[ requestId ];
				var func = request.success;
				if(result.error) {
					func = request.error;
				}
				this[ func ]( result );
				delete this._meta.requests[ requestId ];
			}
		}

	},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	subscribe: function( opt ){
		return vood.utilAdapter.subscribe( opt );
	},
	////-----------------------------------------------------------------------------------------
	// handles this.model callback
	_modelSuccess: function( response ){
		
		this._meta.modelFinished = true;
		if( _.isArray( response )) { // this.content should always be an object, thatfor i put arrays into this.content.values
			this.meta.key = 'values';
			console.info( this._meta.path + ' had an model which returned an array. Put it instead of content, to content.values' );
		}
		if( this.model.key ){ // Model-Value does not have to be on top-layer of this._meta.contentSpace
			this.set( this.model.key, response.result, this.model.opt );
		} else {
			this.setAll( response.result, this.model.opt );
		}
		this.setAll( response.result, this.model.opt );
		vood.controllerHelper.callInits(); // Not really needed, but fastens things up
	},
	////-----------------------------------------------------------------------------------------
	// handles this.model errorcallback
	_modelError: function( response ){
		this._meta.modelFinished = true;
		this.set( 'error', true );
		this.set( 'message', response.result );
		vood.controllerHelper.callInits(); // Not really needed, but fastens things up
		console.warn( this._meta.path + ' got an error ', response );
	}
};

////-----------------------------------------------------------------------------------------
// Function for creating classes
function controller( path, obj ){
	if( vood.controllerHelper.list[ path ] ){
		console.warn( 'The Controller for ' + path + ' already exists' );
	} else {
		vood.controllerHelper.list[ path ] = vood.Obj( 'controller', path, obj );
		vood.controllerHelper.list[ path ]._meta.path = path;
		vood.utilHelper.merge( vood.controllerHelper.list[ path ], classContent );
	}
}

export default controller;