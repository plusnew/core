export default vood.Obj({
	////-----------------------------------------------------------------------------------------
	// You should overwrite this with the vood.init({helperAdapter: adapterImplementation: {host: 'localhost', port: '8080'}})
	adapterImplementation: {
		////-----------------------------------------------------------------------------------------
		// protocol used for the api-call
		protocol: 'http',
		////-----------------------------------------------------------------------------------------
		// host used for the api-call
		host: window.location.hostname,
		////-----------------------------------------------------------------------------------------
		// port used for the api-call, you can set it to null to use default if wanted
		port: 2901,
		////-----------------------------------------------------------------------------------------
		// takes this.host and this.port and builds a domain
		getDomain: function() {
			var url = this.protocol + '://' + this.host;
			if(this.port) {
				url += ':' + this.port;
			}
			return url;
		},
		////-----------------------------------------------------------------------------------------
		// builds url
		buildUrl: function( opt ){
			return this.getDomain() + '/' + opt.model.controller + '/' + opt.model.action;
		},
		////-----------------------------------------------------------------------------------------
		// actually sends the request
		sendRequest: function( opt ){
			var request = $.ajax( this.buildUrl(opt), { success: this.success, error: this.error } );
			request.requestId = opt.requestId;
		},
		////-----------------------------------------------------------------------------------------
		// takes the successresponse
		success: function( result, foo, bar, foobar ){
			debugger;
		},
		////-----------------------------------------------------------------------------------------
		// takes the errorresponse
		error: function( result, error, response ){
			var requestId = result.requestId;
			vood.helperAdapter.emit( requestId, { error: result.status, result: response } );
		}
	},
	////-----------------------------------------------------------------------------------------
	// constants for the requeststates
	states: {
		pending: 0,
		sended: 1,
		finished: 2
	},
	////-----------------------------------------------------------------------------------------
	// Increment for the requestId
	id: 0,
	////-----------------------------------------------------------------------------------------
	// Holds the pending requests
	requests: {},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the adapter itself, does application set an custom adapter?
	// sets up runloop job for sending
	// @TODO
	init: function() {
		this.addJob( {callback: this.trigger} );
	},
	////-----------------------------------------------------------------------------------------
	// Takes new requests
	send: function( opt ){
		this.checkValidity(opt);
		opt.requestState = this.states.pending;
		opt.requestId = ++this.id;
		this.requests[ this.id ] = opt;
		return this.id;
	},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the request
	checkValidity: function( opt ){
		if( !opt.model || !opt.model.controller || !opt.model.action ){
			throw 'Your given request is not valid';
		}
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	trigger: function() {
		for( var id in vood.helperAdapter.requests ){
			if( vood.helperAdapter.requests[ id ].requestState === vood.helperAdapter.states.pending ) {
				vood.helperAdapter.requests[ id ].requestState = vood.helperAdapter.states.sended;
				vood.helperAdapter.adapterImplementation.sendRequest( vood.helperAdapter.requests[ id ] );
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	emit: function( id, response ){
		if( this.requests[ id ] ){
			this.requests[ id ].requestState = this.states.finished;
			vood.controllerHelper.call('*', '_checkRequest', [ id, response ] );
		} else {
			throw 'There was no request with id ' + id;
		}

	}
});