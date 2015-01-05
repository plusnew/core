vood.Controller('main/detail', {
	model: {
		controller: 'podcasts',
		action: 'detail',
		payload: {
			podcast: 'dashboard'
		}
	},
	changePodcast: function( evt ) {
		if( this.set( 'model.payload.podcast', evt.id, {contentSpace: false} )){ // Only returns true when value changed
			this.fetch();
		}
	},
	notify: function() {
		// debugger;
	}
});