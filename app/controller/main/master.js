vood.Controller('main/master', {
	model: {
		controller: 'podcasts',
		action: 'list'
	},
	content: {
		selected: 'dashboard',
	},
	preprocess: function( response ) {
		return _.merge( _.clone(this.content), response );
	},
	init: function() {
		this.triggerSelection();
	},
	triggerSelection: function() {
		this.trigger( 'url', [ 'podcasts', this.get( 'selected' ) ] );
	},
	changePodcast: function( data, evt, target) {
		this.set( 'selected', data.id);
		this.triggerSelection();
	}
});