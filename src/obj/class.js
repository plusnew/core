import util from 'snew/helper/util';

const defaults = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: false
	},
	////-----------------------------------------------------------------------------------------
	// default initfunction
	init() {},
	////-----------------------------------------------------------------------------------------
	// default destroyfunction, gets called before instance gets terminated
	// @TODO not yet implemented
	destroy() {},
	////-----------------------------------------------------------------------------------------
	// metafunction for getting content
	get(key, opt) {
		return this._handleData( 'get', key, null, opt );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for setting content, returns if value has changed and if it gets rendered
	set(key, value, opt) {
		return this._handleData( 'set', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// adds runloopjobs with including uid of the jobs, for removage if controller gets destroyed
	addJob(opt) {
		opt.uid = this._meta.uid;
		snew.runloopHelper._addJob(opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for setting content, returns if value has changed and if it gets rendered
	setAll(value, opt) {
		let key = this._meta.contentSpace;
		if( !opt ) opt = {};
		if( opt.contentSpace !== undefined ) {
			key = opt.contentSpace;
		}
		opt.contentSpace = false; // Needs to be done, to don't get a prefix, but set the complete content

		return this._handleData( 'set', key, value, opt );
	},

	////-----------------------------------------------------------------------------------------
	// metafunction for pushing content, only for arrays
	push(key, value, opt) {
		return this._handleData( 'push', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for pushing content, return true when added to array, returns false when it was already added
	pushOnce(key, value, opt) {
		return this._handleData( 'pushOnce', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for pop index of an array/obj
	pop(key, value, opt) {
		return this._handleData( 'pop', key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// handles all the events
	trigger(type, ...args) {
		return snew.eventsystem.trigger( type, '*', args );
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for handling data-operations
	_handleData(type, key, value, opt) {
		if(!opt) {opt = {};}
		key = this._generateRealpath( key, opt );
		return this._handleRealData( type, key, value, opt );
	},
	////-----------------------------------------------------------------------------------------
	// query management of data-handling
	_handleRealData(type, key, value, opt, objType, offset) {
		if(!offset) offset = 0;
		const result    = snew.objHelper.hasQuery( key ) ? [] : undefined;

		// @FIXME is the getter-logic from tempart useful? Then no clone and slice is needed
		for( let i = offset; i < key.length; i++ ){
			const part = key[ i ];
			const lastKey  = key[ key.length - 1 ];

			if( snew.objHelper.isQuery( part )){
				const obj = this._getReference( key )[ lastKey ];
				for( const arrIndex in obj ){
					if( obj.hasOwnProperty( arrIndex) && snew.objHelper.isTrue( obj[ arrIndex ], part, opt.query )){
						result.push(this._handleRealData( type, key, value, opt ));
					}
				}
				return result;
			} else if( i + 1 == key.length ){
				return this._handleTypes( type, key, value, opt );
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// actual handling of the data (without queries)
	_handleTypes(type, keyParts, value, opt) {
		let changed = opt.forceRender || false;
		let result = false;
		let current;
		switch (type){
			case 'get':
				result = this._getReference( keyParts )[ keyParts[ keyParts.length - 1 ]];
				break;
			case 'set':
				current = this._getReference( keyParts )[ keyParts[ keyParts.length - 1 ]];
				if( current != value ){
					this._getReference( keyParts )[ keyParts[ keyParts.length - 1 ]] = value;
					result = true;
					changed = true;
				}
				break;
			case 'push':
			case 'pushOnce':
				current = this._getReference( keyParts, 'arr' )[ keyParts[ keyParts.length - 1 ]];
				if( type != 'pushOnce' || current.indexOf( value ) === -1 ){
					current.push(value);
					result = true;
					changed = true;
				}
				break;
			default:
				throw `type ${type} is not defined`;
		}

		if( changed && this.view ){ // @FIXME wont work when we made a set inside the view
			// Only rerender when its relevant to the template
			let contentSpace = false;
			let dirtyKey     = null;
			if(this._meta.contentSpace) {
				const contentParts  = this._meta.contentSpace.split( '.' );
				const contentLength = contentParts.length;
				const prefix        = keyParts.slice(0, contentLength);
				dirtyKey = keyParts.slice(contentLength, keyParts.length).join( '.' );
				if( snew.utilHelper.isEqual(prefix, contentParts) ) contentSpace = true;
			} else {
				dirtyKey = keyParts.join( '.' );
				contentSpace = true;
			}

			if( contentSpace ){
				if( snew.viewHelper.dirtyHandling !== false ){
					this.view._addDirty(dirtyKey, type, value);
				} else {
					this.view._render();
				}
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// handling of dotnotation, returns the last but one. creates objects if not existent
	_getReference(keyParts, type) {
		var foo = Math.random();
		let content = null;
		let start   = null; // @FIXME improve this start thingi
		if(keyParts.length === 1) {
			content = this;
			start = 0;
		} else {
			content = this[ keyParts[ 0 ]]; // @FIXME when initial value is not defined, nothing works
			start = 1;
		}
		for( let i = start; i < keyParts.length; i++ ){
			let part = keyParts[ i ];

			if( !content[ part ] ){
				if( type == 'arr' && i < keyParts.length) {
					content[ part ] = [];
					console.info(
						`${keyParts.slice( 0, i + 1 ).join( '.' )} did not exist, so I created it for you`
					);
				} else if( type == 'obj'  || i + 1 < keyParts.length){
					content[ part ] = {};
					console.info(
						`${keyParts.slice( 0, i + 1 ).join( '.' )} did not exist, so I created it for you`
					);
				}
			}

			if( i == keyParts.length - 1){
				if(keyParts.length === 1) {
					return this;
				} else {
					return content; // sadly i cant return the property-value itself, reference would get lost
				}
			} else {
				content = content[ part ];
			}
		}
		throw 'Something went totally wrong at getting the references';
	},
	////-----------------------------------------------------------------------------------------
	// adds (optional) prefix to path
	_generateRealpath(key, opt) {
		if(typeof key === 'string') {
			key = key.split('.');
		}
		if( opt.contentSpace ){
			key.unshift(opt.contentSpace);
		} else if( this._meta.contentSpace ){
			key.unshift(this._meta.contentSpace);
		}
		return key;
	},

};

const meta = function() {
	const obj = arguments[ arguments.length - 1 ];
	const properties = util.clone( defaults );
	util.merge(obj, properties);
	if( arguments.length > 1 ){
		obj._meta.type = arguments[ 0 ];
	}
	if( arguments.length > 2 ){
		obj._meta.path = arguments[ 1 ];
	}
	return obj;
};

export default meta;