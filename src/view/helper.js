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
	uidDomNode: 'SCRIPT',
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
	eventListeners: ['keydown'],
	////-----------------------------------------------------------------------------------------
	// maps e.g. keypresses to trigger shortevents for enter and escape-keys
	eventMap: {
		keydown: {
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
		const dom = document.querySelector( this.entrance );
		if( dom ) {
			const result = snew.controllerHelper.create( this.startPath, null, {} );
			dom.outerHTML = result.html;
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
		return snew.utilHelper.clone( this.list[ path ] );
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
		do {
			const endUid = this.isUidEndObj( obj );
			const uid = this.isUidObj( obj );

			if( endUid ){
				excludes.push(endUid); // Needed to handle siblings, which do not surround the target
			} else if( uid && excludes.indexOf( uid ) === -1 ){
				result.push(uid);
			}
			if(obj.previousSibling) {
				obj = obj.previousSibling;
			} else {
				obj = obj.parentNode;
			}
		} while(obj);

		return result;
	},
	////-----------------------------------------------------------------------------------------
	// checks if dom-node is an uid-obj
	isUidObj(obj) {
		return this._getAttributeValue(obj, this.uidDomNode, this.uidAttrStart);
	},
	////-----------------------------------------------------------------------------------------
	// checks if dom-node is an uid-end-obj
	isUidEndObj(obj) {
		return this._getAttributeValue(obj, this.uidDomNode, this.uidAttrEnd);
	},
	////-----------------------------------------------------------------------------------------
	// expects node type and an attribute key, returns this when exists
	_getAttributeValue(obj, nodeName, attributeName) {
		if(obj.nodeName === nodeName) { // @FIXME
			for( let i = 0; i < obj.attributes.length; i++ ) {
				if( obj.attributes[ i ].nodeName === attributeName ){
					return obj.attributes[ i ].nodeValue;
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// adds all dom events which the framework ist listening for
	addEvents() {
		for(let i = 0; i < this.eventListeners.length; i++) {
			document.body.addEventListener(this.eventListeners[ i ], evt => {
				return snew.viewHelper.handleEvent( evt );
			});
		}
		window.addEventListener('hashchange', () => {
			this.trigger('hashchange', location.hash);
		});
	},
	////-----------------------------------------------------------------------------------------
	// wrapper for triggering events, selects corresponding parent-controllers
	handleEvent(evt) {
		const uids = this.getUids( evt.target );
		this.triggerExtra(evt);
		this.updateData(evt);
	},
	////-----------------------------------------------------------------------------------------
	// way binding from dom
	updateData(evt) {
		if( evt.type == 'keydown'){ // Keydown is fired before the input has its value => using setTimeout (because its more responsive then keypress/keyup)
			setTimeout(function() {
				const identifier = evt.target.getAttribute('tempartstart');
				if( identifier && evt.keyCode !== 13 ){ // Enter button don't bring changes into the values
					const pos = identifier.indexOf( '-' );
					const uid = identifier.slice( 0, pos );
					const blockId = identifier.slice( pos + 1, identifier.length );
					const controllers = snew.search( uid );
					if( controllers.length === 1 ){
						const controller = controllers[ 0 ];
						let value = evt.target.value;
						controller.view._updateCurrent(blockId, 'value', value);
					} else {
						throw 'Getting the correct controller failed somehow';
					}
				}
			}, 0);
		}
	},
	////-----------------------------------------------------------------------------------------
	// triggers eventmaps like keypresses to shortevents like "enterkey" and escapekey
	triggerExtra(evt) {
		if( this.eventMap[ evt.type ] ){
			for( const index in this.eventMap[ evt.type ] ) {
				const eventValue = evt[ index ];
				if( eventValue ) {
					const mapValue = this.eventMap[ evt.type ][ index ][ eventValue ];
					if( mapValue ){
						this.trigger(mapValue, evt); // @TODO does this evt needs a clone?
					}
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// recusively goes upside in the dom, to collect dataattributes
	getAttributes(target, result) {
		if(!result) result = {};

		if(target) {
			const attributes = target.attributes;

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
			if(target.parentNode) {
				result = this.getAttributes(target.parentNode, result);
			}
		}
		return result;
	}
});