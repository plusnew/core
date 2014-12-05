var classContent = {
	_meta: {
		registry: true,
		contentSpace: 'content',
		type: 'view'
	},
	construct: function() {}, // Gets triggered before template gets rendered
	send: function(opt) {
		vood.utilAdapter.send(opt);
	},
	subscribe: function(opt) {
		vood.utilAdapter.subscribe(opt);
	}
};

function controller(path, obj) {
	vood.controllerHelper.list[path] = vood.Obj('controller', path, obj);
	vood.controllerHelper.list[path]._meta.path = path;
	vood.utilHelper.merge(vood.controllerHelper.list[path], classContent);
}

export default controller;