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
		var parts = this.parseUrl();
		if( !this.changed ){
			this.change( location.hash );
		}
	},
	////-----------------------------------------------------------------------------------------
	// Can be called via this.trigger( 'changeUrl', ['foo', 'bar'])
	changeUrl: function( parts ) {
		var newHash = parts.join( this.delimiter );
		if( location.hash != '#' + newHash ){
			location.hash = newHash;
			return true;
		}
		
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
	// parses the hash
	parseUrl: function() {
		var newUrl = location.hash.substring( 1,location.hash.length );
		return newUrl.split( this.delimiter );
	},
	////-----------------------------------------------------------------------------------------
	// listens to the hachchange event from the browser
	change: function( hash ){
		this.state = this.parseUrl();
		this.triggerUrl();
	},
	triggerUrl: function() {
		this.changed = true;
		var url    = this.getUrl();
		var result = null;
		if( url.length ){
			result = this.trigger( '/' + url );
		} else {
			result = this.trigger( '/' );
		}
		if(result.length === 0) {
			this.trigger('/404');
		}
	}
});