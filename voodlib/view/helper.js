export default vood.Obj({
	templatePrefix: 'templates/',
	entrance: 'body',
	startPath: 'main/app',
	uidAttrStart: 'data-begin',
	uidAttrEnd: 'data-end',
	list: {},
	init: function() {
		this.checkValidity();
		this.insertApp();
	},
	create: function(path) {
		return this.getEntity(path);
	},
	insertApp: function() {
		var id      = vood.controllerHelper.create(this.startPath, {});
		this.addId($(this.entrance), id);
		vood.controllerHelper.get(id)[0].view._render();
	},
	addId: function(obj, id) {
		obj.first().before(this.scriptStart(id));
		obj.last().after(this.scriptEnd(id));
	},
	getEntity: function(path) {
		if(!this.list[path]) {
			console.log('View ' + path + ' does not exist');
			vood.View(path, {_meta: {pseudo: true}});
		}
		return _.cloneDeep(this.list[path]);
	},
	compileJade: function(path, content) {
		return '<div class="first">foo</div><div class="second">bar</div>';
	},
	
	scriptStart: function(id) {
		return '<script ' + this.uidAttrStart + '="' + id + '"></script>';
	},
	scriptEnd: function(id) {
		return '<script ' + this.uidAttrEnd   + '="' + id + '"></script>';
	},
	trigger: function(controllers, namespace, entity) {

	},
	checkValidity: function() {
		if(!this.entrance) {
			throw "App entrance is not defined";
		}
	}
});