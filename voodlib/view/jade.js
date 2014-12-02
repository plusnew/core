export default vood.Obj({
	mixins: {},
	buf: [],
	addMixins: function(mixins, buf) {
		this.buf = buf;
		mixins.spawn = function(path, opt) {
			vood.viewJade.buf.push(vood.controllerHelper.create(path).html);
		};
	}
});