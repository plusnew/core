function controller(path, obj) {
	vood.controllerHelper.list[path] = vood.Obj('controller', path, obj);
}

export default controller;