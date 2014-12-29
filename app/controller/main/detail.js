vood.Controller('main/detail', {
	model: {
		controller: 'podcasts',
		action: 'detail',
		payload: {
			podcast: '*'
		}
	},
	changePodcast: function( selected ) {
		if( this.set( 'model.payload.podcast', selected, {contentSpace: false} )){ // Only returns true when value changed
			this.fetch();
		}
	},
	notify: function() {
		// debugger;
	}
});