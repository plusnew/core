import Obj from 'snew/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// In which package does requirejs use the templates
	templatePrefix: 'templates/',
	////-----------------------------------------------------------------------------------------
	// Jquery selector where the this.startPath controller and view are added
	entrance: '#app',
	////-----------------------------------------------------------------------------------------
	// Controller which is added at startup
	startPath: 'main/app',
	////-----------------------------------------------------------------------------------------
	// domnode-attribute for start uid node
	uidDomNode: 'script',
	////-----------------------------------------------------------------------------------------
	// domnode-attribute for start uid node
	uidAttrStart: 'data-begin',
	////-----------------------------------------------------------------------------------------
	// domnode-attribute for end uid node
	uidAttrEnd: 'data-end',
	////-----------------------------------------------------------------------------------------
	// Existing classes collection
	list: {},
	////-----------------------------------------------------------------------------------------
	// saves which views changed
	dirties: [],
	////-----------------------------------------------------------------------------------------
	// Decides which instances are asked for handling events
	eventSpaces: [ 'controllerHelper', 'helperHelper' ],
	////-----------------------------------------------------------------------------------------
	// JQuery events which the framework is listening for
	eventString: 'click submit change mouseover mouseout mousemove mouseup mousedown keyup keydown drag dragstart dragover mousewheel',
	////-----------------------------------------------------------------------------------------
	// maps e.g. keypresses to trigger shortevents for enter and escape-keys
	eventMap: {
		keyup: {
			keyCode: {
				13: 'view.enterkey',
				27: 'view.escapekey'
			}
			
		}
	},
	_meta: {
		contentSpace: false
	},
	////-----------------------------------------------------------------------------------------
	// adds dirtychecking to runloop and inserts first view this.startPath and starts document event listener
	init() {
		tempartCompiler.partial = this.partialHandling; // Thats how you configure tempart...
		if( this.dirtyHandling !== false ){
			this.addJob({callback: this.dirtyChecking});
		}
		this.checkValidity();
		this.insertApp();
		this.addEvents();
	},
	////-----------------------------------------------------------------------------------------
	// adds dirtychecking to runloop and inserts first view this.startPath and starts document event listener
	partialHandling(block, context, currentValues, dirties, path) {
		// @TODO add uid to currentValues
		currentValues[ block.id ] = {path, uid: 1 + snew.controllerHelper.id};
		return snew.controllerHelper.create( path, context ).html;
	},
	////-----------------------------------------------------------------------------------------
	// creates instance of view
	create(path, opt) {
		return this.getEntity(path);
	},
	////-----------------------------------------------------------------------------------------
	// inserts first view to this.entrance
	insertApp() {
		const result = snew.controllerHelper.create( this.startPath, null, {} );
		const dom = $( this.entrance );
		if( dom.length === 1 ) {
			$( this.entrance ).replaceWith(result.html);
		} else {
			console.error('snew.viewHelper.entrance was not represented in dom properly', dom);
		}
	},
	////-----------------------------------------------------------------------------------------
	// gets class and returns instance
	getEntity(path) {
		if( !this.list[ path ]){
			console.log(`View ${path} does not exist`);
			snew.View(path, {_meta: {pseudo: true}});
		}
		return _.cloneDeep( this.list[ path ] );
	},
	////-----------------------------------------------------------------------------------------
	// start uid
	// @TODO move this to the templating engine
	scriptStart(id, path) {
		return `<${this.uidDomNode} ${this.uidAttrStart}="${id}" data-template="${path}"></${this.uidDomNode}>`;
	},
	////-----------------------------------------------------------------------------------------
	// end uid
	scriptEnd(id) {
		return `<${this.uidDomNode} ${this.uidAttrEnd}="${id}"></${this.uidDomNode}>`;
	},
	////-----------------------------------------------------------------------------------------
	// some basic checking if values are correct
	checkValidity() {
		if( !this.entrance ){
			throw "App entrance is not defined";
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks which views are dirty, to asynchronoesly render them
	dirtyChecking() {
		if(snew.viewHelper.dirties) {
			// console.log(snew.viewHelper.dirties.length);
			for( let i = 0; i < snew.viewHelper.dirties.length; i++ ){
				const uid = snew.viewHelper.dirties[i];
				const controllers = snew.controllerHelper.search(uid);
				for( let controllerIndex = 0; controllerIndex < controllers.length; controllerIndex++ ){
					const controller = controllers[ controllerIndex ];
					controller.view._handleDirties();
				}
			}
			snew.viewHelper.dirties = [];
		}
	},
	////-----------------------------------------------------------------------------------------
	// iterates through all dom-nodes to the top and returns an array of controllers
	getUids(obj) {
		const result    = [];
		const excludes  = [];
		while( obj.length > 0 ){
			// Needed handling with prev() instead of siblings(), to keep the order of the uids
			let prevObj = obj.prev();
			while( prevObj.length > 0 ){
				const endUid = this.isUidEndObj( prevObj );
				const uid = this.isUidObj( prevObj );

				if( endUid ){
					excludes.push(endUid); // Needed to handle siblings, which do not surround the target
				} else if( uid && excludes.indexOf( uid ) === -1 ){
					result.push(uid);
				}
				prevObj = prevObj.prev();
			}
			obj = obj.parent();
		}

		return result;
	},
	////-----------------------------------------------------------------------------------------
	// checks if dom-node is an uid-obj
	isUidObj(obj) {
		if( obj.is( `${this.uidDomNode}[${this.uidAttrStart}]` )) {
			return obj.attr( this.uidAttrStart );
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks if dom-node is an uid-end-obj
	isUidEndObj(obj) {
		if( obj.is( `${this.uidDomNode}[${this.uidAttrEnd}]` )) {
			return obj.attr( this.uidAttrEnd );
		}
	},
	////-----------------------------------------------------------------------------------------
	// adds all dom events which the framework ist listening for
	addEvents() {
		$( 'body' ).on(this.eventString, evt => {
			return snew.viewHelper.handleEvent( evt );
		});
		$( window ).on('hashchange', () => {
			trhis.trigger('hashchange', location.hash);
		});
	},
	////-----------------------------------------------------------------------------------------
	// wrapper for triggering events, selects corresponding parent-controllers
	handleEvent(evt) {
		const uids = this.getUids( $(evt.target));
		this.triggerExtra(evt);
		this.updateData(evt);
		return this.triggerEvent( evt.type, evt, {controllers: uids, pseudo: false} );
	},
	////-----------------------------------------------------------------------------------------
	// way binding from dom
	updateData(evt) {
		if( evt.type == 'keyup' || evt.type == 'keydown' ){
			const identifier = evt.target.getAttribute('tempartstart');
			if( identifier && evt.keyCode !== 13 ){ // Enter button don't bring changes into the values
				const pos = identifier.indexOf( '-' );
				const uid = identifier.slice( 0, pos );
				const blockId = identifier.slice( pos + 1, identifier.length );
				const controllers = snew.search( uid );
				if( controllers.length === 1 ){
					const controller = controllers[ 0 ];
					controller.view._updateCurrent(blockId, 'value', evt.target.value);
				} else {
					throw 'Getting the correct controller failed somehow';
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// handles all the events
	// @TODO move this to the eventhandler
	triggerEvent(type, evt, opt) {
		if( !evt ) evt = {};
		if( type.search(':') != -1) throw 'events are not allowed to have a : inside' ;
		opt = this.prepareEventOpt( opt );
		let result = [];
		for( let i = 0; i < opt.controllers.length; i++){
			const uid = opt.controllers[i];
			for( let spaceIndex = 0; spaceIndex < this.eventSpaces.length; spaceIndex++ ) {
				let controllers = snew[ this.eventSpaces[ spaceIndex] ].search( uid );
				for( let controllerIndex = 0; controllerIndex < controllers.length; controllerIndex++ ){
					let value = null;
					if(controllers[ controllerIndex ].view) {
						value = controllers[ controllerIndex ].view._checkForEvent( type, evt, opt );
					} else {
						value = controllers[ controllerIndex ]._checkForEvent( type, evt, opt );
					}
					if( value.found ) result.push(value.result);
					if( !opt.pseudo && evt.propagation === false ) break;
				}
				if( !opt.pseudo && evt.propagation === false ) break;
			}
			if( !opt.pseudo && evt.propagation === false ) break;
		}

		// Warn only when it either was a clickevent, or an pseudoevent
		if( !result.length && (opt.pseudo || (!opt.pseudo && evt.type == 'click' ))) {
			console.warn(`There was no eventdefinition found ${type}`);
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// triggers eventmaps like keypresses to shortevents like "enterkey" and escapekey
	// @TODO make this deprecated
	triggerExtra(evt) {
		if( this.eventMap[ evt.type ] ){
			for( const index in this.eventMap[ evt.type ] ) {
				const eventValue = evt[ index ];
				if( eventValue ) {
					const mapValue = this.eventMap[ evt.type ][ index ][ eventValue ];
					if( mapValue ){
						this.trigger(mapValue, _.clone( evt ));
					}
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks variables inside the eventdefition
	// @TODO make this deprecated, and move it to the view-class
	checkEventMatch(definition, type, opt) {
		const reserved = ':';
		if(definition == type) {
			return true;
		} else {
			let pos  = definition.search(reserved);
			const diff = 0;
			const params = {};
			while( pos != -1 ){
				const leftoverDefinition = definition.substring( pos + 1, definition.length );
				const leftover           = type.substring( pos, type.length );
				let lengthDefinition   = leftoverDefinition.search( /\W/ );
				let length             = leftover.search( /\W/ );
				if( lengthDefinition === -1 ) lengthDefinition = leftoverDefinition.length;
				if( length === -1 ) length = leftover.length;
				let key                = leftoverDefinition.substring( 0, lengthDefinition);
				const value              = leftover.substring( 0, length);
				const reg                = new RegExp(`:${key}`);
				definition = definition.replace(reg, value);
				pos = definition.search(reserved);
				params[ key ] = value;
				
			}

			if(definition === type) {
				for( let i in params ) {
					opt[ i ] = params[ i ];
				}
				return true;
			}
			
		}
	},
	////-----------------------------------------------------------------------------------------
	// recusively goes upside in the dom, to collect dataattributes
	getAttributes(target, result) {
		if(!result) result = {};

		if(target) {
			const attributes = target[0].attributes;

			if(result.id === undefined && target.attr('id') && attributes['data-id'] === undefined) {
				result.id = target.attr('id');
			}

			const excludes = ['ember-extension'];

			for (const index in attributes) {
				if (attributes.hasOwnProperty(index)) {
					const name  = attributes[index].name, value = attributes[index].value;
					if(name && name.search('data-') === 0) {
						let key = name.replace(/data-/, '');
						if(result[key] === undefined && excludes.indexOf(key) == -1) { // SHould only overwrite when not set
							result[key] = value || null;
						}
					}
				}
			}
			const parent = target.parent();
			if(parent.length > 0) {
				result = this.getAttributes(parent, result);
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// makes some default values for events
	prepareEventOpt(opt) {
		if( !opt ) opt = {};
		if( opt.pseudo !== false ) opt.pseudo = true;
		if( !opt.controllers ) opt.controllers = [ '*' ];
		return opt;
	}
});