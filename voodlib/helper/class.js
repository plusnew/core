vood.helper = vood.Obj({});
function helper(path, obj) {
	if(!app.helper) app.helper = {};
	app.helper[path] = vood.Obj('helper', path, obj);
}

export default helper;