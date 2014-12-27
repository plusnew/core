export default vood.Obj({
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
		opt.requestId = id++;
		this.requests[id] = opt;
	},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the request
	// @TODO
	checkValidity: function( opt ){
		return true;
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and actually sends them
	// @TODO
	trigger: function() {

	}
});