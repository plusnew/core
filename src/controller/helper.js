import Obj from 'vood/obj/class';

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
	// Init adds needed runloop jobs (garbage collection, and async calling of controller-inits)
	init: function(){
		if( this.garbageCollection !== false ){
			this.addJob( {callback: this.garbage} );
		}
		this.addJob( {callback: this.callInits} );
	},
	////-----------------------------------------------------------------------------------------
	// Creates the controller-instance of the class, returns the html
	create: function( path, content, opt ){
		var id = ++this.id;
		this.inits.push( id );
		this.anons[ id ]                 = this.getEntity( path );
		this.anons[ id ]._meta.uid       = id;
		if( content ){
			// @TODO logic is propably wrong
			_.merge( this.anons[ id ].content, content );
		}
		this.anons[ id ].view            = vood.viewHelper.create( path, opt );
		this.anons[ id ].view.controller = this.anons[ id ];
		vood.utilHelper.safeCall( this.anons[ id ], 'construct' );
		vood.utilHelper.safeCall( this.anons[ id ].view, 'construct' );
		var html                            = this.anons[ id ].view._compileComplete();
		return {uid: id, html: html};
	},
	////-----------------------------------------------------------------------------------------
	// Is a runloop jobs, for calling the init of new controllers, needs to be called after instanciating
	callInits: function( force ){
		var result = [];
		var found  = false;
		for( var i = 0; i < vood.controllerHelper.inits.length; i++ ){
			var id = vood.controllerHelper.inits[ i ];
			found = true;
			if( vood.controllerHelper.controllerExists( id )) {
				if( ! vood.controllerHelper.anons[ id ]._loadModel( id )) {
					vood.utilHelper.safeCall( vood.controllerHelper.anons[ id ], 'init' );
					vood.utilHelper.safeCall( vood.controllerHelper.anons[ id ].view, 'init' );
				} else {
					// If modelloading is not finished, then we want to keep the id
					result.push( id );
				}
			}
		}
		if( found && result.length === 0 && !vood.controllerHelper.systemLoaded){ // Finish should only be called when inits where called, and models are finished
			vood.controllerHelper.systemLoaded = true;
			vood.helperHelper.callInits();
		}
		vood.controllerHelper.inits = result;
	},
	////-----------------------------------------------------------------------------------------
	// Checks if controller exists, when it doesnt, it warns the console
	controllerExists: function( id ) {
		if( vood.controllerHelper.anons[ id ] ) {
			return true;
		}
		console.error( 'Controller does not exist', id );
	},
	////-----------------------------------------------------------------------------------------
	// Returns the class
	getEntity: function( path ){
		if( !this.list[ path ] ){
			console.log( 'Controller ' + path + ' does not exist' );
			vood.Controller( path, {_meta: { pseudo: true , path: path}} );
		}
		return _.cloneDeep( this.list[ path ] );
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	find: function( path ) {
		return this._iterate( path );
	},
	////-----------------------------------------------------------------------------------------
	// Calls the matching controllers with the function
	call: function( path, call, args ) {
		return this._iterate( path, call, args );
	},
	////-----------------------------------------------------------------------------------------
	// Metafunction for getting and calling controllers, please only use this function with get/call. the api mostlikely changes
	_iterate: function( path, call, args ){
		var id = window.parseInt( path, 10 );
		if( isNaN( id ) || !this.anons[ id ] ){ // Check is not necessary, could be done with iteration as well, but this is faster at large scale
			var result = [];
			for( var i in this.anons ){
				if( this.anons.hasOwnProperty( i ) ){
					// path can either be the namespace, or the uid
					if( this.anons[ i ]._meta.path == path || path == '@each' || path == '*' || this.anons[ i ]._meta.uid == path ){
						if( call ) {
							var value = vood.utilHelper.safeCall( this.anons[ i ], call, args );
							result.push( value );
						} else {
							result.push( this.anons[ i ] );
						}
					}
				}
			}
			return result;
		} else {
			if( call ) {
				return [ vood.utilHelper.safeCall( this.anons[ id ], call, args ) ];
			} else {
				return [ this.anons[ id ]];
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if the instanciated controllers are represented in the dom
	// @TODO implementation
	garbage: function(){
		
	}
});