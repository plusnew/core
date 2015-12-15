import Obj from 'snew/obj/class';

export default Obj({
	// Helper goes into userspace, because he propably wants to overwrite it
	events: [{
		action: 'change',
		type: 'hashchange'
	}, {
		action: 'changeUrl',
		type: 'route'
	}],
	////-----------------------------------------------------------------------------------------
	// how should the hash be formed?
	delimiter: '/',
	////-----------------------------------------------------------------------------------------
	// This init is called, when the application startup is done
	init() {
		if( !this.changed ){
			this.change(location.hash); // @TODO make this work at server environment
		}
	},
	////-----------------------------------------------------------------------------------------
	// parses the hash and return the state
	getState() {
		const newUrl = location.hash.substring( 1,location.hash.length );
		const parts = newUrl.split( this.delimiter );
		while( parts.length > 0 && parts[ parts.length - 1] === '' ){ // Removes trailing slashes
			parts.pop();
		}

		return parts;
	},
	////-----------------------------------------------------------------------------------------
	// Can be called via this.trigger( 'changeUrl', ['foo', 'bar'])
	changeUrl(parts) {
		const newHash = parts.join( this.delimiter );
		if( location.hash != `#${newHash}` ){
			location.hash = newHash;
			return true;
		}
		
	},
	////-----------------------------------------------------------------------------------------
	// Tells the browser hash/state
	writeUrl() {
		location.hash = this.getUrl();
	},
	////-----------------------------------------------------------------------------------------
	// tells the url of the state
	getUrl(state) {
		return state.join( this.delimiter );
	},
	////-----------------------------------------------------------------------------------------
	// listens to the hachchange event from the browser
	change(hash) {
		this.triggerUrl(this.getState());
	},
	////-----------------------------------------------------------------------------------------
	// triggers events and checks if there was an listener for it, if not it triggers a /404
	triggerUrl(state) {
		this.changed = true;
		let result = null;
		const url = this.getUrl( state );
		if( url.length ){
			result = this.trigger( `/${url}` );
		} else {
			result = this.trigger( '/' );
		}
		if(result.length === 0) {
			this.trigger('/404');
		}
	}
});