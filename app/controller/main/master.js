vood.Controller('main/master', {
	model: {
		controller: 'podcasts',
		action: 'list'
	},
	content: {
		selected: 'dashboard',
	},
	preprocess: function( response ) {
		return _.merge( _.clone( this.content ), response );
	},
	init: function() {
		this.getSelection();
		this.triggerSelection();
	},
	getSelection: function(){
		var state = app.helper.statemanager.getState();
		if( state[0] === 'podcasts' && state.length >= 2 ){
			this.set( 'selected', state[1] );
		}
	},
	triggerSelection: function() {
		this.trigger( 'url', [ 'podcasts', this.get( 'selected' ) ] );
	},
	changePodcast: function( data, evt, target) {
		this.set( 'selected', data.id);
		this.triggerSelection();
	}
});