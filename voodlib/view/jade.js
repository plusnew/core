export default vood.Obj({
	mixins: {},
	buf: [],
	addMixins: function( mixins, buf ){
		this.buf = buf;
		this.mixins.spawn = function( buf, path, opt ){
			buf.push( vood.controllerHelper.create( path ).html );
		};
		for( var index in this.mixins ){
			if( !mixins[ index ] ) {
				mixins[ index ] = this.mixins[ index ];
			}
		}
	},
	mixinFinished: function( mixins ){
		for( var index in mixins ){
			this.mixins[ index ] = mixins[ index ];
		}
	}
});