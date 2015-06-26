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
var Obj = require( voodPrefix + 'obj/class' ).default;

window.vood = Obj({
	////-----------------------------------------------------------------------------------------
	// abstract class of everything
	Obj: Obj,
	////-----------------------------------------------------------------------------------------
	// a list of prefixes of all modules which should be loaded
	types: [ 'obj', 'util', 'view', 'controller', 'mixin', 'widget', 'helper' ],
	////-----------------------------------------------------------------------------------------
	// Overwriting of core-modules and calling inits of modules
	init: function( opt ){
		console.log( 'Can I haz some voods?' );
		_.merge( vood, opt );
		this.executeInit();
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	get: function( path ){
		return this.controllerHelper.get( path );
	},
	////-----------------------------------------------------------------------------------------
	// calls inits of the core-modules
	executeInit: function(){
		for( var index in this ){
			if( _.isObject( this[ index ] ) && _.isFunction( this[index].init )){
				this[index].init();
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// loads core and app
	loadAll: function(){
		window.app = vood.Obj({});

		this.load( this, voodPrefix, 'default', true );
		this.load( null, 'appkit/' );
	},
	////-----------------------------------------------------------------------------------------
	// loading of core or app
	load: function( space, prefix, property, transform ){
		var seen = requirejs._eak_seen;
		for( var i = 0; i < this.types.length; i++  ){
			for( var seenIndex in seen ){
				var type = prefix + this.types[ i ].toLowerCase();
				if( seenIndex.search( type ) === 0 ){
					var name = seenIndex;
					if( space ){
						if( transform ){
							name = this.transform( seenIndex, prefix );
						}
						space[ name ] = require( seenIndex )[ property ];
					} else {
						require( seenIndex );
					}
					
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// making slashes into camelcase
	transform: function( name, prefix ){
		var transform = '',
			upper     = false;
		name          = name.replace( prefix, '' );

		for( var index in name ){
			if( name.hasOwnProperty( index )){
				var character = name[ index ];
				// i don't want to write slashes to access core components, so its camelcase
				if( character == '/' ){
					upper = true;
				}
				else if( upper ){
					// When the rest ends with class, then just make it uppercase and stop the rest of transformation
					if( name.substr( index, name.length - 1 ) == 'class' ){
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