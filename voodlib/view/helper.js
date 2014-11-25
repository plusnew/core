export default vood.Obj({
	templatePrefix: 'templates/',
	entrance: 'body',
	init: function() {
		this.checkValidity();
	},
	checkValidity: function() {
		if(!this.entrance) {
			throw "App entrance is not defined";
		}
	}
});