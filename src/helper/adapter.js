import Obj from 'snew/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// You should overwrite this with the snew.init({helperAdapter: adapterImplementation: {host: 'localhost', port: '8080'}})
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
		// path prefix used for the api-call, you can set it to an empty string
		path: '/api',
		////-----------------------------------------------------------------------------------------
		// takes this.host and this.port and builds a domain
		getDomain: function() {
			let url = `${this.protocol}://${this.host}`;
			if( this.port ){
				url += `:${this.port}`;
			}
			return url;
		},
		////-----------------------------------------------------------------------------------------
		// builds url
		buildUrl: function(opt) {
			return `${this.getDomain()}${this.path}/${opt.model.controller}/${opt.model.action}`;
		},
		////-----------------------------------------------------------------------------------------
		// actually sends the request
		sendRequest: function(opt) {
			const data = JSON.stringify(opt.model.payload);
			const request = $.ajax( this.buildUrl(opt), { success: this.success, error: this.error, data: data, processData: false, contentType: 'application/json', type: 'post' } );
			request.requestId = opt.requestId;
		},
		////-----------------------------------------------------------------------------------------
		// takes the successresponse
		success: function(response, status, xhr) {
			const requestId = xhr.requestId;
			snew.helperAdapter.emit(requestId, { result: response});
		},
		////-----------------------------------------------------------------------------------------
		// takes the errorresponse
		error: function(xhr, status, response) {
			let requestId = xhr.requestId;
			try {
				snew.helperAdapter.emit(requestId, { error: xhr.status, result: response });
			} catch( err ) {
				snew.helperAdapter.emit(requestId, { error: '500', result: 'API response was not valid' });
			}
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
	// Checks validity of the adapter itself, does application set an custom adapter? @TODO
	// sets up runloop job for sending
	init() {
		this.addJob({callback: this.trigger});
	},
	////-----------------------------------------------------------------------------------------
	// Takes new requests
	send(opt) {
		this.checkValidity(opt);
		opt.requestState = this.states.pending;
		opt.requestId = ++this.id;
		this.requests[ this.id ] = opt;
		return this.id;
	},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the request
	checkValidity(opt) {
		if( !opt.model || !opt.model.controller || !opt.model.action ){
			throw 'Your given request is not valid';
		}
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	trigger() {
		for( const id in snew.helperAdapter.requests ){
			if( snew.helperAdapter.requests[ id ].requestState === snew.helperAdapter.states.pending ) {
				snew.helperAdapter.requests[ id ].requestState = snew.helperAdapter.states.sended;
				snew.helperAdapter.adapterImplementation.sendRequest(snew.helperAdapter.requests[ id ]);
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	emit(id, response) {
		if( this.requests[ id ] ){
			this.requests[ id ].requestState = this.states.finished;
			snew.controllerHelper.call('*', '_checkRequest', [ id, response ]);
		} else {
			throw `There was no request with id ${id}`;
		}
	}
});