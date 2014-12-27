export default vood.Obj({
	////-----------------------------------------------------------------------------------------
	// You should overwrite this with the vood.init({helperAdapter: adapterImplementation: {host: 'localhost', port: '8080'}})
	adapterImplementation: {
		////-----------------------------------------------------------------------------------------
		// protocol used for the api-call
		protocol: 'http',
		////-----------------------------------------------------------------------------------------
		// host used for the api-call
		host: window.location.host,
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
			return this.getDomain() + '/' + opt.controller + '/' + opt.action;
		},
		////-----------------------------------------------------------------------------------------
		// actually sends the request
		sendRequest: function( opt ){
			$.ajax( this.buildUrl(opt), { success: this.success, error: this.error } );
		},
		////-----------------------------------------------------------------------------------------
		// takes the successresponse
		success: function( result ){
			debugger;
		},
		////-----------------------------------------------------------------------------------------
		// takes the errorresponse
		error: function( result ){
			debugger;
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

	},
	////-----------------------------------------------------------------------------------------
	// Takes new requests
	send: function( opt ){
		this.checkValidity();
		opt.requestState = this.states.pending;
		opt.requestId = ++this.id;
		this.requests[ this.id ] = opt;
	},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the request
	// @TODO
	checkValidity: function( opt ){
		return true;
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	trigger: function() {
		for( var id in this.requests ){
			if( this.requests[ id ].requestState === this.states.pending ) {
				this.adapterImplementation.sendRequest( this.requests[ id ] );
			}
		}
	}
});