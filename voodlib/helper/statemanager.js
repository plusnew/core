export default vood.Helper( 'statemanager', {
	// Helper goes into userspace, because he propably wants to overwrite it
	events: [{
		action: 'change',
		type: 'hashchange'
	}, {
		action: 'changeUrl',
		type: 'url'
	}],
	////-----------------------------------------------------------------------------------------
	// how should the hash be formed?
	delimiter: '/',
	////-----------------------------------------------------------------------------------------
	// Keeps the urlparts inside the memory
	state: [],
	////-----------------------------------------------------------------------------------------
	// This init is called, when the application startup is done
	init: function() {
		// Needs improvement, if the hash changed inside the startup
		this.change( location.hash );
	},
	////-----------------------------------------------------------------------------------------
	// Can be called via this.trigger( 'changeUrl', ['foo', 'bar'])
	changeUrl: function( parts ) {
		location.hash = parts.join( this.delimiter );
	},
	////-----------------------------------------------------------------------------------------
	// Tells the browser hash/state
	writeUrl: function() {
		location.hash = this.getUrl();
	},
	////-----------------------------------------------------------------------------------------
	// tells the url of the state
	getUrl: function() {
		return this.state.join( this.delimiter );
	},
	////-----------------------------------------------------------------------------------------
	// listens to the hachchange event from the browser
	change: function( hash ){
		var newUrl = hash.substring( 1, hash.length);
		this.state = newUrl.split( this.delimiter );
		this.triggerUrl();
	},
	triggerUrl: function() {
		var url    = this.getUrl();
		var result = null;
		if(url.length) {
			result = this.trigger(url);
		} else {
			result = this.trigger('/');
		}
		if(result.length === 0) {
			this.trigger('404');
		}
	}
});