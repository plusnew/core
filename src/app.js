/*
                  SNEW
                 's new
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

import Obj               from 'snew/obj/class';
import objHelper         from 'snew/obj/helper';
import Controller        from 'snew/controller/class';
import controllerHelper  from 'snew/controller/helper';
import Helper            from 'snew/helper/class';
import helperHelper      from 'snew/helper/helper';
import eventsystemHelper from 'snew/helper/eventsystem';
import routerHelper      from 'snew/helper/router';
import utilHelper        from 'snew/helper/util';
import runloopHelper     from 'snew/helper/runloop';
import View              from 'snew/view/class';
import viewHelper        from 'snew/view/helper';
import Template          from 'snew/template/class';
import templateHelper    from 'snew/template/helper';

const snew = Obj({
	////-----------------------------------------------------------------------------------------
	// abstract class of everything
	Obj: Obj,
	////-----------------------------------------------------------------------------------------
	// A flag needed to advice an application programmer
	didInit: false,
	////-----------------------------------------------------------------------------------------
	// Overwriting of core-modules and calling inits of modules
	init(opt) {
		this.didInit = true;
		if(!window.app) {
			window.app = {};
		}
		console.log('Can I haz some snews?');
		this.utilHelper.merge(snew, opt);
		this.executeInit();
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	search(path) {
		return this.controllerHelper.search( path );
	},
	////-----------------------------------------------------------------------------------------
	// calls inits of the core-modules
	executeInit() {
		const setups = ['eventsystem', 'viewHelper'];
		// viewhelper should be initted first - it creates all the controllers and views
		// which should be able to listen to helper trigger()
		for( const setupIndex in setups ){
			if( setups.hasOwnProperty( setupIndex )){
				snew[ setups[ setupIndex]].init();
			}
		}

		for( const index in this ){
			if( typeof this[ index ] === 'object' && typeof this[index].init === 'function' && setups.indexOf( index ) === -1 ){
				this[index].init();
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// making slashes into camelcase
	transform(name, prefix) {
		let transform = '', upper     = false;
		name = name.replace( prefix, '' );

		for( const index in name ){
			if( name.hasOwnProperty( index )){
				const character = name[ index ];
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

snew.objHelper        = objHelper;
snew.Controller       = Controller;
snew.controllerHelper = controllerHelper;
snew.Helper           = Helper;
snew.helperHelper     = helperHelper;
// snew.adapterHelper    = adapterHelper;
snew.eventsystem      = eventsystemHelper;
snew.routerHelper     = routerHelper;
snew.utilHelper       = utilHelper;
snew.runloopHelper    = runloopHelper;
snew.View             = View;
snew.viewHelper       = viewHelper;
snew.Template         = Template;
snew.templateHelper   = templateHelper;

setTimeout(() => {
	if(!snew.didInit) console.log('To setup a snew application you should call snew.init({})');
}, 10);

window.snew = snew;
export default snew;