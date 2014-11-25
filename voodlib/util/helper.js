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
	}
};

export default window.vood ? vood.Obj(obj) : obj;