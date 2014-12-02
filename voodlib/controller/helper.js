export default vood.Obj({
	id: 0,
	list: {},
	anons: {},
	inits: [],
	garbageCollection: true,
	init: function() {
		if(this.garbageCollection !== false) {
			this.addJob({callback: this.garbage});
		}
		this.addJob({callback: this.callInits});

	},
	create: function(path, content, opt) {
		this.id++;
		opt.id = this.id;
		this.anons[this.id]                 = this.getEntity(path);
		this.anons[this.id]._meta.uid       = this.id;
		if(content) {
			// @TODO logic is propably wrong
			_.merge(this.anons[this.id].content, content);
		}
		// this.anons[this.id].construct();
		this.anons[this.id].view            = vood.viewHelper.create(path, opt);
		this.anons[this.id].view.controller = this.anons[this.id];
		var html                            = this.anons[this.id].view._compileComplete();
		this.inits.push(this.id);
		return {uid: this.id, html: html};
	},
	callInits: function() {
		for(var i = 0; i < vood.controllerHelper.inits; i++) {
			var id = vood.controllerHelper.inits[i];
			vood.controllerHelper.anons[id].init();
			vood.controllerHelper.anons[id].view.init();
		}
		vood.controllerHelper.inits = [];
	},
	getEntity: function(path) {
		if(!this.list[path]) {
			console.log('Controller ' + path + ' does not exist');
			vood.Controller(path, {_meta: {pseudo: true}});
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
	},
	garbage: function() {
		
	}
});