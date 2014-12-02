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
		var id = this.id;
		this.inits.push(id);
		if(!opt) { opt = {};}
		opt.id = id;
		this.anons[id]                 = this.getEntity(path);
		this.anons[id]._meta.uid       = id;
		if(content) {
			// @TODO logic is propably wrong
			_.merge(this.anons[id].content, content);
		}
		// this.anons[id].construct();
		this.anons[id].view            = vood.viewHelper.create(path, opt);
		this.anons[id].view.controller = this.anons[id];
		var html                            = this.anons[id].view._compileComplete();
		return {uid: id, html: html};
	},
	callInits: function() {
		for(var i = 0; i < vood.controllerHelper.inits.length; i++) {
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