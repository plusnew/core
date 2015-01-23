vood.View( 'player/container', {
	player: '#podlove',
	events: [{
		type: 'changeItem',
		action: 'changeItem'
	}],
	init: function() {
		this.podlove();
	},
	notify: function() {
		this.podlove();
	},
	podlove: function() {
		// this.podlove();
		if( this.controller.get( 'item' )){
			var player = this.obj( 'player' );
			// player.podlovewebplayer();
		}

	}
});