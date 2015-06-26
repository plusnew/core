export default vood.Obj({
	mixins: {
		////-----------------------------------------------------------------------------------------
		// Spawns new controller/view and returns html
		spawn: function( buf, path, opt ){
			buf.push( vood.controllerHelper.create( path ).html );
		},
		////-----------------------------------------------------------------------------------------
		// Spawns new controller/view and returns html
		// @TODO creating a controller without the anon array. pseudoevents should not iterate over these
		widget: function( buf, path, opt ){}
	},
	////-----------------------------------------------------------------------------------------
	// Adds global mixins to local
	addMixins: function( mixins, buf ){
		for( var index in this.mixins ){
			if( !mixins[ index ] ) {
				mixins[ index ] = this.mixins[ index ];
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Adds local mixins to global
	mixinFinished: function( mixins ){
		// @TODO overwrite notes should be triggered
		for( var index in mixins ){
			this.mixins[ index ] = mixins[ index ];
		}
	}
});