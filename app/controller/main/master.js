vood.Controller('main/master', {
	model: {
		controller: 'podcasts',
		action: 'list'
	},
	content: {
		selected: '*',
	},
	preprocess: function( response ) {
		return _.merge( _.clone(this.content), response );
	},
	init: function() {
		this.triggerSelection();
	},
	triggerSelection: function() {
		this.trigger( 'changePodcast', this.get( 'selected' ));
	},
	changePodcast: function( data, evt, target) {
		this.set( 'selected', data.id);
		this.trigger( 'changePodcast', this.get( 'selected' ));
	}
});