var classContent = {
	_meta: {
		type: 'view'
	},
	_render: function() {
		while(this.obj('root').length > 1) {
			this.obj('root').last().remove(); // I want only one object to get replaced, else its possible to have the content dubled
		}
		this.obj('root').replaceWith(this._compile());

	},
	_compile: function() {
		var id     = this.controller._meta.uid;
		var result = vood.viewHelper.compileJade(this.controller._meta.path, this.controller.content);

		return result;
	},
	obj: function(path) {
		var selector = null;
		var id = this.controller._meta.uid;
		if(path !== 'root') {
			if(!this[path]) {
				throw 'Couldnt get you the obj because of missing definition';
			}
			selector = this[path];
		}
		return $('script[' + vood.viewHelper.uidAttrStart + '=' + id + ']').nextUntil('script[' + vood.viewHelper.uidAttrEnd + '=' + id +']', selector);
	}
};

function view(path, obj) {
	vood.viewHelper.list[path] = vood.Obj('view', path, obj);
	vood.utilHelper.merge(vood.viewHelper.list[path], classContent);
}

export default view;