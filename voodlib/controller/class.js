var classContent = {
	_specialControllerFunction: function() {

	}
};

function controller(path, obj) {
	vood.controllerHelper.list[path] = vood.Obj('controller', path, obj);
	vood.controllerHelper.list[path]._meta.path = path;
	vood.utilHelper.merge(vood.controllerHelper.list[path], classContent);
}

export default controller;