String.prototype.capitalize = function() {
	return this[0].toUpperCase() + this.slice(1, this.length);
};

var obj = {
	merge: function(target, obj) {
		for(var index in obj) {
				if(obj.hasOwnProperty(index)) {
					if(!target[index]) {
						target[index] = obj[index];
					} else if(_.isObject(target[index]) && _.isObject(obj[index]) && !_.isFunction(target[index]) && !_.isFunction(obj[index])) {
						this.merge(target[index], obj[index]);
					}
				}
			}
	},
	insertAt: function(src, index, str) {
		return src.substr(0, index) + str + src.substr(index);
	},
	safeCall: function(scope, func) {
		if(app.debug) {
			scope[func]();
		} else {
			try {
				scope[func]();
			} catch(err) {
				console.error(err);
			}
		}
	}
};

export default window.vood ? vood.Obj(obj) : obj;