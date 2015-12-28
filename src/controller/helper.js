import Obj from 'snew/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// Increment of the upcoming controller-ids
	id: 0,
	////-----------------------------------------------------------------------------------------
	// Existing classes collection
	list: {},
	////-----------------------------------------------------------------------------------------
	// Controller Instances
	anons: {},
	////-----------------------------------------------------------------------------------------
	// Ids of the controller, which need a init() call
	inits: [],
	////-----------------------------------------------------------------------------------------
	// Flag if the garbagecollection should be enabled
	garbageCollection: true,
	////-----------------------------------------------------------------------------------------
	// Flag if the garbagecollection should be enabled
	systemLoaded: false,
	////-----------------------------------------------------------------------------------------
	// holds the registrations of other modules, which will be triggered for creation
	_registers: {},
	////-----------------------------------------------------------------------------------------
	// Init adds needed runloop jobs (garbage collection, and async calling of controller-inits)
	init() {
		if( this.garbageCollection !== false ){
			this.addJob({callback: this.garbage});
		}
		this.addJob({callback: this._callInits});
	},
	////-----------------------------------------------------------------------------------------
	// Creates the controller-instance of the class, returns the html
	create(path, content, opt) {
		let id = ++this.id;
		this.inits.push(id);
		this.anons[ id ] = this.getEntity( path );
		this.anons[ id ]._meta.uid = id;
		if( content ){
			// @TODO logic is propably wrong
			snew.utilHelper.merge(this.anons[ id ].content, content);
		}
		this.anons[ id ].view = snew.viewHelper.create( path, opt );
		this.anons[ id ].view.controller = this.anons[ id ];
		this._handleRegisters(this.anons[ id ], opt);
		snew.utilHelper.safeCall(this.anons[ id ], 'construct');
		snew.utilHelper.safeCall(this.anons[ id ].view, 'construct');
		const html                            = this.anons[ id ].view._compileComplete();
		return {uid: id, html: html};
	},
	////-----------------------------------------------------------------------------------------
	// Is a runloop jobs, for calling the init of new controllers, needs to be called after instanciating
	_callInits(force) {
		const result = [];
		let found  = false;
		for( let i = 0; i < snew.controllerHelper.inits.length; i++ ){
			const id = snew.controllerHelper.inits[ i ];
			found = true;
			if( snew.controllerHelper.controllerExists( id )) {
				if( ! snew.controllerHelper.anons[ id ]._loadModel( id )) {
					snew.utilHelper.safeCall(snew.controllerHelper.anons[ id ], 'init');
					snew.utilHelper.safeCall(snew.controllerHelper.anons[ id ].view, 'init');
				} else {
					// If modelloading is not finished, then we want to keep the id
					result.push(id);
				}
			}
		}
		if( found && result.length === 0 && !snew.controllerHelper.systemLoaded){ // Finish should only be called when inits where called, and models are finished
			snew.controllerHelper.systemLoaded = true;
			snew.helperHelper.callInits();
		}
		snew.controllerHelper.inits = result;
	},
	////-----------------------------------------------------------------------------------------
	// Checks if controller exists, when it doesnt, it warns the console
	controllerExists(id) {
		if( snew.controllerHelper.anons[ id ] ) {
			return true;
		}
		console.error('Controller does not exist', id);
	},
	////-----------------------------------------------------------------------------------------
	// Returns the class
	getEntity(path) {
		if( !this.list[ path ] ){
			console.log(`Controller ${path} did not exist, I created it for you`);
			snew.Controller(path, {_meta: { pseudo: true , path: path}});
		}
		return snew.utilHelper.clone( this.list[ path ] );
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	search(path) {
		return this._iterate( path );
	},
	////-----------------------------------------------------------------------------------------
	// Calls the matching controllers with the function
	call(path, call, args) {
		return this._iterate( path, call, args );
	},
	////-----------------------------------------------------------------------------------------
	// Metafunction for getting and calling controllers, please only use this function with get/call. the api mostlikely changes
	_iterate(path, call, args) {
		const id = window.parseInt( path, 10 );
		if( isNaN( id ) || !this.anons[ id ] ){ // Check is not necessary, could be done with iteration as well, but this is faster at large scale
			const result = [];
			for( const i in this.anons ){
				if( this.anons.hasOwnProperty( i ) ){
					// path can either be the namespace, or the uid
					if( this.anons[ i ]._meta.path == path || path == '@each' || path == '*' || this.anons[ i ]._meta.uid == path ){
						if( call ) {
							const value = snew.utilHelper.safeCall( this.anons[ i ], call, args );
							result.push(value);
						} else {
							result.push(this.anons[ i ]);
						}
					}
				}
			}
			return result;
		} else {
			if( call ) {
				return [ snew.utilHelper.safeCall( this.anons[ id ], call, args ) ];
			} else {
				return [ this.anons[ id ]];
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// 
	_addRegister(namespace, func) {
		if( !this._registers[namespace] ){
			this._registers[namespace] = func;
		} else {
			console.warn(`${namespace} has already an registration`);
		}
	},
	////-----------------------------------------------------------------------------------------
	// triggers the registers
	_handleRegisters(instance) {
		for( const index in this._registers ){
			const func = this._registers[ index ];
			snew[ index ][ func ](instance, 'controller');
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if the instanciated controllers are represented in the dom
	// @TODO implementation
	garbage() {
		
	}
});