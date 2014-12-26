export default vood.Obj({
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
	callInits: function(){
		for( var i = 0; i < vood.controllerHelper.inits.length; i++ ){
			var id = vood.controllerHelper.inits[ i ];
			vood.utilHelper.safeCall( vood.controllerHelper.anons[ id ], 'init' );
			vood.utilHelper.safeCall( vood.controllerHelper.anons[ id ].view, 'init' );
		}
		vood.controllerHelper.inits = [];
	},
	////-----------------------------------------------------------------------------------------
	// Returns the class
	getEntity: function( path ){
		if( !this.list[ path ] ){
			console.log( 'Controller ' + path + ' does not exist' );
			vood.Controller( path, {_meta: {pseudo: true}} );
		}
		return _.cloneDeep( this.list[ path ] );
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	get: function( path ){
		var id = window.parseInt( path, 10 );
		if(isNaN(id) || !this.anons[ id ] ){
			var result = [];
			for( var i in this.anons ){
				if( this.anons.hasOwnProperty( i )){
					if( this.anons[ i ]._meta.path == path || path == '*' ){
						result.push( this.anons[ i ] );
					}
				}
			}
			return result;
		} else {
			return [this.anons [ id ]];
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if the instanciated controllers are represented in the dom
	// @TODO implementation
	garbage: function(){
		
	}
});