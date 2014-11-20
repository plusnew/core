var prefix = 'voodkit/';
var meta = require(prefix + 'meta/class').default;

var vood = meta({
	Obj: meta,
	types: ['util', 'View', 'Controller', 'Helper'],
	create: function(opt) {
		this.load();
		console.log('blargs');
	},
	transform: function(name) {
		var transform = '',
			upper     = false;
		name          = name.replace(prefix, '');
		for (var index in name) {
			if (name.hasOwnProperty(index)) {
				var character = name[index];
				if (character == '/') {
					upper = true;
				}
				else if (upper) {
					if(name.substr(index, name.length - 1) == 'class') {
						transform = transform.capitalize();
						break;
					}
					transform += character.toUpperCase();
					upper = false;
				}
				else {
					transform += character;
				}
			}
		}

		return transform;
	},
	load: function() {
		var seen = requirejs._eak_seen;
		for(var i = 0; i < this.types.length; i++) {
			for(var seenIndex in seen) {
				var type = prefix + this.types[i].toLowerCase();
				if(seenIndex.search(type) === 0) {
					this[this.transform(seenIndex)] = require(seenIndex);
				}
			}
		}
	}
});

export default vood;