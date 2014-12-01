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
	get: function(key, opt) {
		return this._handleData('get', key, null, opt);
	},
	set: function(key, value, opt) {
		return this._handleData('set', key, value, opt);
	},
	_handleData: function(type, key, value, opt) {
		var result = null;
		return result;
	},
	addJob: function(opt) {
		opt.uid = this._meta.uid;
		vood.utilRunloop.addJob(opt);
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