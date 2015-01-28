vood.Controller('main/detail', {
	changePodcast: function( evt ){
		var model = {
			controller: 'podcasts',
			action: 'detail',
			payload: {podcast: evt.id}
		};

		if( this.set( 'model', model, {contentSpace: false} )){ // Only returns true when value changed
			this.fetch();
		}
	},
	changeItem: function( data ){
		this.trigger( 'changeItem', this.content.podcast.item[data.index] );
	},
	notify: function() {
		var res = this.get('podcast.item.title=={title}', {query: {title: ['LNP129 Ureinwanderer', 'LNP126 Ich wollte ja zur Revolution, aber war voll']}});
		console.log(res);
	}
});