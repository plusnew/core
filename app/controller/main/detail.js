vood.Controller('main/detail', {
	changePodcast: function( evt ) {
		var model = {
			controller: 'podcasts',
			action: 'detail',
			payload: {podcast: evt.id}
		};

		if( this.set( 'model', model, {contentSpace: false} )){ // Only returns true when value changed
			this.fetch();
		}
	}
});