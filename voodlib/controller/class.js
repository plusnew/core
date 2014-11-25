function controller(path, obj) {
	vood.controllerHelper.list[path] = vood.Obj('controller', path, obj);
	vood.controllerHelper.list[path]._meta.path = path;
}

export default controller;