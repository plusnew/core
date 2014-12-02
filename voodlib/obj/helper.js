export default vood.Obj({
	_isTrue: function(obj, query) {
		return true;
	},
	_isQuery: function(key) {
		var res = false;
		if(key.indexOf('=') !== -1 || key.indexOf('@') !== -1) {
			res = true;
		}
		return res;
	},
});