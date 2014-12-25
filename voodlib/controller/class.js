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
	// Gets triggered before template gets rendered, this.content can be manipulated without consequences
	construct: function(){},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	send: function( opt ){
		// @TODO add validity check
		// @TODO add request to _reqs
		return vood.utilAdapter.send( opt );
	},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	subscribe: function( opt ){
		return vood.utilAdapter.subscribe( opt );
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