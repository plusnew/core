var defaults = {
	_meta: {
		contentSpace: 'content',
		getKey: function(key) {
			if(this.contentSpace) {
				key = this.contentSpace + '.' + key;
			}
			return key;
		}
	},
	get: function(key) {
		return this._get(key);
	},
	set: function(key, value) {
		return this._set(key);
	},
	_get: function(key) {
		return this[this._meta.getKey(key)]; // @TODO
	},
	_set: function(key, value) {
		this[this._meta.getKey(key)] = value; // @TODO
	}
};

var meta = function(opt) {
	var obj = arguments[arguments.length - 1];

	for(var index in defaults) {
		if(defaults.hasOwnProperty(index) && !obj[index]) {
			obj[index] = defaults[index];
		}
	}
	if(arguments.length > 1) {
		obj.type = opt[0];
	}
	if(arguments.length > 2) {
		obj.path = opt[1];
	}
	return obj;
};

export default meta;