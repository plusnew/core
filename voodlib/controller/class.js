var classContent = {
	_meta: {
		registry: true,
		contentSpace: 'content',
		type: 'view'
	},
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered, this.content can be manipulated without consequences
	construct: function() {},
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

function controller( path, obj ){
	vood.controllerHelper.list[ path ] = vood.Obj( 'controller', path, obj );
	vood.controllerHelper.list[ path ]._meta.path = path;
	vood.utilHelper.merge( vood.controllerHelper.list[ path ], classContent );
}

export default controller;