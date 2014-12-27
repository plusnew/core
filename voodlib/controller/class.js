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
		type: 'controller'
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
		// @TODO add validity check
		// @TODO add request to _reqs
		debugger;
		return vood.utilAdapter.send( opt );
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
	// triggers the adaper and creates request reference
	subscribe: function( opt ){
		return vood.utilAdapter.subscribe( opt );
	},
	////-----------------------------------------------------------------------------------------
	// 
	_modelSuccess: function( result ){
		this._meta.modelFinished = true;
		ion.controllerHelper.callInits(); // Not really needed, but fastens things up
	},
	_modelError: function( result ){
		this._meta.modelFinished = true;
		this.set( 'error', true );
		ion.controllerHelper.callInits(); // Not really needed, but fastens things up
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