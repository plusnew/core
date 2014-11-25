function view(path, obj) {
	vood.viewHelper.list[path] = vood.Obj('view', path, obj);
}

export default view;