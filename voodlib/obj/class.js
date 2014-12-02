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
	init: function() {}, // Not really used, only that i don't have to check if its exitent
	get: function(key, opt) {
		return this._handleData('get', key, null, opt);
	},
	set: function(key, value, opt) {
		return this._handleData('set', key, value, opt);
	},
	push: function(key, opt) {
		return this._handleData('push', key, null, opt);
	},
	pushOnce: function(key, value, opt) {
		return this._handleData('pushOnce', key, value, opt);
	},
	pop: function(key, value, opt) {
		return this._handleData('pop', key, value, opt);
	},
	_handleData: function(type, key, value, opt) {
		if(!opt) {opt = {};}
		key = this._generateRealpath(key, opt);
		return this._handleRealData(type, key, value, opt);
	},
	_handleRealData: function(type, key, value, opt) {
		var keyParts = key.split('.');
		var partClone = _.clone(keyParts);
		var result   = vood.objHelper._isQuery(key) ? [] : undefined;

		// @TODO add to registry
		for(var i = 0; i < keyParts.length; i++) {
			var part = keyParts[i];
			var previous = partClone.slice(0, i);
			var lastKey  = previous[previous.length - 1];

			if(vood.objHelper._isQuery(part)) {
				var obj      = this._getReference(previous)[lastKey];
				if(_.isArray(obj)) {
					for(var arrIndex = 0; arrIndex < obj.length; arrIndex++) {
						if(vood.objHelper._isTrue(obj[arrIndex], part)) {
							opt.addReg = false;
							partClone[i] = arrIndex;
							result.push(this._handleRealData(type, partClone.join('.'), value, opt));
						}
					}
				} else {
					var msg = keyParts.splice(0, i).join('.') + ' is not an array';
					if(opt.exception === false) {
						console.warn(msg);
					} else {
						throw msg;
					}
				}
				return result;
			} else if(i + 1 == keyParts.length){
				return this._handleTypes(type, keyParts, value, opt);
			}
		}
		return result;
	},
	_handleTypes: function(type, keyParts, value, opt) {
		var changed = false;
		var result = false;
		switch (type) {
			case 'get':
				result = this._getReference(keyParts)[keyParts[keyParts.length - 1]];
				break;
			case 'set':
				var current = this._getReference(keyParts)[keyParts[keyParts.length - 1]];
				if(current != value) {
					this._getReference(keyParts)[keyParts[keyParts.length - 1]] = value;
					result = true;
					changed = true;
				}
				break;
			default:
				throw 'type ' + type + ' is not defined';
		}

		if(changed && this.view) {
			if(vood.viewHelper.dirtyHandling !== false) {
				this.view._meta.dirty = true;
			} else {
				this.view._render();
			}
		}
		return result;
	},
	_getReference: function(keyParts) {
		var content = this[keyParts[0]];
		for(var i = 1; i < keyParts.length; i++) {
			var part = keyParts[i];

			if(i == keyParts.length - 1) {
				// @TODO check if the comment is correct
				return content; // sadly i cant return the property-value itself, reference would get lost
			}

			if(!content[part] && i + 1 < keyParts.length) { // @TODO Check for sideeffects -> === undefined was it before
				content[part] = {};
				content = content[part];
				console.info(keyParts.slice(0, i + 1).join('.') + ' did not exist, so I created it for you');
			} else {
				content = content[part];
			}
		}
	},
	_generateRealpath: function(key, opt) {
		if(opt.contentSpace) {
			return opt.contentSpace + '.' + key;
		} else if(this._meta.contentSpace){
			return this._meta.contentSpace + '.' + key;
		} else {
			return key;
		}
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