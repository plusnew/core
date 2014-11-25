export default vood.Obj({
	id: 0,
	list: {},
	anons: {},
	create: function(path) {
		this.id++;
		this.anons[this.id]           = this.getEntity(path);
		this.anons[this.id]._meta.uid = this.id;
	},
	getEntity: function(path) {
		if(!this.list[path]) {
			throw path + ' does not exist';
		}
		return _.cloneDeep(this.list[path]);
	},
	get: function(path) {
		var result = [];
		for(var i in this.anons) {
			if(this.anons.hasOwnProperty(i)) {
				if(path == i || this.anons[i]._meta.path == path || path == '*') {
					result.push(this.anons[i]);
				}
			}
		}
		return result;
	}
});