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
		if(!window.app) {
			window.app = {};
		}
		console.log('Can I haz some snews?');
		this.utilHelper.merge(snew, opt);
		this.executeInit();
		this.didInit = true;
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
	}
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