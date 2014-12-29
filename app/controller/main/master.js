vood.Controller('main/master', {
	model: {
		controller: 'podcasts',
		action: 'list'
	},
	content: {
		selected: '*',
	},
	preprocess: function( response ) {
		return _.merge( this.content, response );
	},
	init: function() {
		this.triggerSelection();
	},
	triggerSelection: function() {
		this.trigger( 'changePodcast', this.get( 'selected' ));
	}
});