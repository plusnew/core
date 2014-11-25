var util = require('voodkit/util/helper').default;

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

var meta = function() {
	var obj = arguments[arguments.length - 1];
	var properties = _.cloneDeep(defaults);
	util.merge(obj, properties);
	if(arguments.length > 1) {
		obj._meta.type = arguments[0];
	}
	if(arguments.length > 2) {
		obj._meta.path = arguments[1];
	}
	return obj;
};

export default meta;