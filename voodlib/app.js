/*
                  VOOD
       very object oriented design
                 ,
               ._  \/, ,|_
               -\| \|;|,'_
               `_\|\|;/-.
                `_\\|/._
               ,'__   __`.
              / /_ | | _\ \
             / ((o)| |(o)) \
             |  `--/ \--'  |
       ,--.   `.   '-'   ,'
      (O..O)    `.uuuuu,'
       \==/     _|nnnnn|_
      .'||`. ,-' \_____/ `-.
       _||,-'      | |      `.
      (__)  _,-.   ; |   .'.  `.
      (___)'   |__/___\__|  \(__)
      (__)     :::::::::::  (___)
        ||    :::::::::::::  (__)
        ||    :::::::::::::
             __|   | | _ |__
            (_(_(_,' '._)_)_)
*/

var voodPrefix = 'voodkit/';
var Obj = require(voodPrefix + 'obj/class').default;

window.vood = Obj({
	Obj: Obj,
	types: ['util', 'view', 'controller', 'mixin', 'widget', 'helper'],
	init: function(opt) {
		console.log('blargs');
		_.merge(vood, opt);
		this.executeInit();
		vood.controllerHelper.create('main/app');
	},
	get: function(path) {
		return this.controllerHelper.get(path);
	},
	executeInit: function() {
		for(var index in this) {
			if(_.isObject(this[index]) && _.isFunction(this[index].init)) {
				this[index].init();
			}
		}
	},
	loadAll: function() {
		window.app = vood.Obj({});

		this.load(this, voodPrefix);
		this.load(app, 'appkit/');
	},
	load: function(space, prefix) {
		var seen = requirejs._eak_seen;
		for(var i = 0; i < this.types.length; i++) {
			for(var seenIndex in seen) {
				var type = prefix + this.types[i].toLowerCase();
				if(seenIndex.search(type) === 0) {
					if(voodPrefix == prefix) {
						var path = seenIndex.replace(prefix, '');
						space[this.transform(seenIndex, prefix)] = require(seenIndex).default;
					} else {
						require(seenIndex);
					}
					
				}
			}
		}
	},
	transform: function(name, prefix) {
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
});

vood.loadAll();

export default vood;