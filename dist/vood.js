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

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var voodPrefix = 'voodkit/';
var Obj = require(voodPrefix + 'obj/class')['default'];

window.vood = Obj({
	////-----------------------------------------------------------------------------------------
	// abstract class of everything
	Obj: Obj,
	////-----------------------------------------------------------------------------------------
	// a list of prefixes of all modules which should be loaded
	types: ['obj', 'util', 'view', 'controller', 'mixin', 'widget', 'helper'],
	////-----------------------------------------------------------------------------------------
	// Overwriting of core-modules and calling inits of modules
	init: function init(opt) {
		console.log('Can I haz some voods?');
		_.merge(vood, opt);
		this.executeInit();
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	find: function find(path) {
		return this.controllerHelper.find(path);
	},
	////-----------------------------------------------------------------------------------------
	// calls inits of the core-modules
	executeInit: function executeInit() {
		for (var index in this) {
			if (_.isObject(this[index]) && _.isFunction(this[index].init)) {
				this[index].init();
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// loads core and app
	loadAll: function loadAll() {
		window.app = vood.Obj({});

		this.load(this, voodPrefix, 'default', true);
		this.load(null, 'appkit/');
	},
	////-----------------------------------------------------------------------------------------
	// loading of core or app
	load: function load(space, prefix, property, transform) {
		var seen = requirejs._eak_seen;
		for (var i = 0; i < this.types.length; i++) {
			for (var seenIndex in seen) {
				var type = prefix + this.types[i].toLowerCase();
				if (seenIndex.search(type) === 0) {
					var name = seenIndex;
					if (space) {
						if (transform) {
							name = this.transform(seenIndex, prefix);
						}
						space[name] = require(seenIndex)[property];
					} else {
						require(seenIndex);
					}
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// making slashes into camelcase
	transform: function transform(name, prefix) {
		var transform = '',
		    upper = false;
		name = name.replace(prefix, '');

		for (var index in name) {
			if (name.hasOwnProperty(index)) {
				var character = name[index];
				// i don't want to write slashes to access core components, so its camelcase
				if (character == '/') {
					upper = true;
				} else if (upper) {
					// When the rest ends with class, then just make it uppercase and stop the rest of transformation
					if (name.substr(index, name.length - 1) == 'class') {
						transform = transform.capitalize();
						break;
					}
					transform += character.toUpperCase();
					upper = false;
				} else {
					transform += character;
				}
			}
		}

		return transform;
	}
});

vood.loadAll();

exports['default'] = vood;

var classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Flag if an internal registry should be used
		registry: true,
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'content',
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'controller',
		////-----------------------------------------------------------------------------------------
		// holds all send requests and keeps there state
		requests: {}
	},
	////-----------------------------------------------------------------------------------------
	// Object which the template accesses
	content: {},
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered, this.content can be manipulated without consequences
	// Be careful when you trigger events, subcontroller/siblings will not be exitent
	construct: function construct() {},
	////-----------------------------------------------------------------------------------------
	// Gets triggered each time after the template got rerendered
	notify: function notify() {},
	////-----------------------------------------------------------------------------------------
	// Function to modify the modelresponse, e.g. merge current
	// If you use that, be careful if this.content is an reference, than it would say "nothing changed, no render"
	preprocess: function preprocess(response) {
		return response;
	},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	send: function send(opt) {
		var id = vood.helperAdapter.send(opt);
		// opt is a reference and got a property named requestId from the adapter
		this._meta.requests[id] = opt;
		return id;
	},
	////-----------------------------------------------------------------------------------------
	// triggers the this._loadModel function to reload content
	fetch: function fetch() {
		this._meta.modelFinished = false;
		this._meta.modelLoading = false;
		this._loadModel();
	},
	////-----------------------------------------------------------------------------------------
	// triggers the backend with the value set in this.model, when its not already in the loading process
	// returns wheather the process is running, or if there is nothing to do
	_loadModel: function _loadModel() {
		if (this.model && !this._meta.modelFinished) {
			if (!this._meta.modelLoading) {
				this._meta.modelLoading = true;
				var model = this.model;
				this.send({ model: model, success: '_modelSuccess', error: '_modelError' });
			}
			return true;
		} else {
			return false;
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if given requestId is associated with this controller instance
	_checkRequest: function _checkRequest(incomingId, result) {
		for (var requestId in this._meta.requests) {
			if (requestId == incomingId) {
				var request = this._meta.requests[requestId];
				var func = request.success;
				if (result.error) {
					func = request.error;
				}
				this[func](result);
				delete this._meta.requests[requestId];
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// triggers the adaper and creates request reference
	subscribe: function subscribe(opt) {
		return vood.utilAdapter.subscribe(opt);
	},
	////-----------------------------------------------------------------------------------------
	// handles this.model callback
	_modelSuccess: function _modelSuccess(response) {
		this._meta.modelFinished = true;
		response = this.preprocess(response.result);
		if (_.isArray(response)) {
			// this.content should always be an object, thatfor i put arrays into this.content.values
			this.meta.key = 'values';
			console.info(this._meta.path + ' had an model which returned an array. Put it instead of content, to content.values');
		}
		if (this.model.key) {
			// Model-Value does not have to be on top-layer of this._meta.contentSpace
			this.set(this.model.key, response, this.model.opt);
		} else {
			this.setAll(response, this.model.opt);
		}

		// @TODO call render method of view, init should only be called after rendering
		vood.controllerHelper.callInits(); // Not really needed, but fastens things up
	},
	////-----------------------------------------------------------------------------------------
	// handles this.model errorcallback
	_modelError: function _modelError(response) {
		this._meta.modelFinished = true;
		this.set('error', true);
		this.set('message', response.result);
		vood.controllerHelper.callInits(); // Not really needed, but fastens things up
		console.warn(this._meta.path + ' got an error ', response);
	}
};

////-----------------------------------------------------------------------------------------
// Function for creating classes
function controller(path, obj) {
	if (vood.controllerHelper.list[path]) {
		console.warn('The Controller for ' + path + ' already exists');
	} else {
		vood.controllerHelper.list[path] = vood.Obj('controller', path, obj);
		vood.controllerHelper.list[path]._meta.path = path;
		vood.utilHelper.merge(vood.controllerHelper.list[path], classContent);
	}
}

exports['default'] = controller;
exports['default'] = vood.Obj({
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
	init: function init() {
		if (this.garbageCollection !== false) {
			this.addJob({ callback: this.garbage });
		}
		this.addJob({ callback: this.callInits });
	},
	////-----------------------------------------------------------------------------------------
	// Creates the controller-instance of the class, returns the html
	create: function create(path, content, opt) {
		var id = ++this.id;
		this.inits.push(id);
		this.anons[id] = this.getEntity(path);
		this.anons[id]._meta.uid = id;
		if (content) {
			// @TODO logic is propably wrong
			_.merge(this.anons[id].content, content);
		}
		this.anons[id].view = vood.viewHelper.create(path, opt);
		this.anons[id].view.controller = this.anons[id];
		vood.utilHelper.safeCall(this.anons[id], 'construct');
		vood.utilHelper.safeCall(this.anons[id].view, 'construct');
		var html = this.anons[id].view._compileComplete();
		return { uid: id, html: html };
	},
	////-----------------------------------------------------------------------------------------
	// Is a runloop jobs, for calling the init of new controllers, needs to be called after instanciating
	callInits: function callInits(force) {
		var result = [];
		var found = false;
		for (var i = 0; i < vood.controllerHelper.inits.length; i++) {
			var id = vood.controllerHelper.inits[i];
			found = true;
			if (vood.controllerHelper.controllerExists(id)) {
				if (!vood.controllerHelper.anons[id]._loadModel(id)) {
					vood.utilHelper.safeCall(vood.controllerHelper.anons[id], 'init');
					vood.utilHelper.safeCall(vood.controllerHelper.anons[id].view, 'init');
				} else {
					// If modelloading is not finished, then we want to keep the id
					result.push(id);
				}
			}
		}
		if (found && result.length === 0 && !vood.controllerHelper.systemLoaded) {
			// Finish should only be called when inits where called, and models are finished
			vood.controllerHelper.systemLoaded = true;
			vood.helperHelper.callInits();
		}
		vood.controllerHelper.inits = result;
	},
	////-----------------------------------------------------------------------------------------
	// Checks if controller exists, when it doesnt, it warns the console
	controllerExists: function controllerExists(id) {
		if (vood.controllerHelper.anons[id]) {
			return true;
		}
		console.error('Controller does not exist', id);
	},
	////-----------------------------------------------------------------------------------------
	// Returns the class
	getEntity: function getEntity(path) {
		if (!this.list[path]) {
			console.log('Controller ' + path + ' does not exist');
			vood.Controller(path, { _meta: { pseudo: true, path: path } });
		}
		return _.cloneDeep(this.list[path]);
	},
	////-----------------------------------------------------------------------------------------
	// returns instances of fitting controllers
	find: function find(path) {
		return this._iterate(path);
	},
	////-----------------------------------------------------------------------------------------
	// Calls the matching controllers with the function
	call: function call(path, _call, args) {
		return this._iterate(path, _call, args);
	},
	////-----------------------------------------------------------------------------------------
	// Metafunction for getting and calling controllers, please only use this function with get/call. the api mostlikely changes
	_iterate: function _iterate(path, call, args) {
		var id = window.parseInt(path, 10);
		if (isNaN(id) || !this.anons[id]) {
			// Check is not necessary, could be done with iteration as well, but this is faster at large scale
			var result = [];
			for (var i in this.anons) {
				if (this.anons.hasOwnProperty(i)) {
					// path can either be the namespace, or the uid
					if (this.anons[i]._meta.path == path || path == '@each' || path == '*' || this.anons[i]._meta.uid == path) {
						if (call) {
							var value = vood.utilHelper.safeCall(this.anons[i], call, args);
							result.push(value);
						} else {
							result.push(this.anons[i]);
						}
					}
				}
			}
			return result;
		} else {
			if (call) {
				return [vood.utilHelper.safeCall(this.anons[id], call, args)];
			} else {
				return [this.anons[id]];
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if the instanciated controllers are represented in the dom
	// @TODO implementation
	garbage: function garbage() {}
});
exports['default'] = vood.Obj({
	////-----------------------------------------------------------------------------------------
	// You should overwrite this with the vood.init({helperAdapter: adapterImplementation: {host: 'localhost', port: '8080'}})
	adapterImplementation: {
		////-----------------------------------------------------------------------------------------
		// protocol used for the api-call
		protocol: 'http',
		////-----------------------------------------------------------------------------------------
		// host used for the api-call
		host: window.location.hostname,
		////-----------------------------------------------------------------------------------------
		// port used for the api-call, you can set it to null to use default if wanted
		port: 2901,
		////-----------------------------------------------------------------------------------------
		// path prefix used for the api-call, you can set it to an empty string
		path: '/api',
		////-----------------------------------------------------------------------------------------
		// takes this.host and this.port and builds a domain
		getDomain: function getDomain() {
			var url = this.protocol + '://' + this.host;
			if (this.port) {
				url += ':' + this.port;
			}
			return url;
		},
		////-----------------------------------------------------------------------------------------
		// builds url
		buildUrl: function buildUrl(opt) {
			return this.getDomain() + this.path + '/' + opt.model.controller + '/' + opt.model.action;
		},
		////-----------------------------------------------------------------------------------------
		// actually sends the request
		sendRequest: function sendRequest(opt) {
			var data = JSON.stringify(opt.model.payload);
			var request = $.ajax(this.buildUrl(opt), { success: this.success, error: this.error, data: data, processData: false, contentType: 'application/json', type: 'post' });
			request.requestId = opt.requestId;
		},
		////-----------------------------------------------------------------------------------------
		// takes the successresponse
		success: function success(response, status, xhr) {
			var requestId = xhr.requestId;
			vood.helperAdapter.emit(requestId, { result: response });
		},
		////-----------------------------------------------------------------------------------------
		// takes the errorresponse
		error: function error(xhr, status, response) {
			var requestId = xhr.requestId;
			try {
				vood.helperAdapter.emit(requestId, { error: xhr.status, result: response });
			} catch (err) {
				vood.helperAdapter.emit(requestId, { error: '500', result: 'API response was not valid' });
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// constants for the requeststates
	states: {
		pending: 0,
		sended: 1,
		finished: 2
	},
	////-----------------------------------------------------------------------------------------
	// Increment for the requestId
	id: 0,
	////-----------------------------------------------------------------------------------------
	// Holds the pending requests
	requests: {},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the adapter itself, does application set an custom adapter? @TODO
	// sets up runloop job for sending
	init: function init() {
		this.addJob({ callback: this.trigger });
	},
	////-----------------------------------------------------------------------------------------
	// Takes new requests
	send: function send(opt) {
		this.checkValidity(opt);
		opt.requestState = this.states.pending;
		opt.requestId = ++this.id;
		this.requests[this.id] = opt;
		return this.id;
	},
	////-----------------------------------------------------------------------------------------
	// Checks validity of the request
	checkValidity: function checkValidity(opt) {
		if (!opt.model || !opt.model.controller || !opt.model.action) {
			throw 'Your given request is not valid';
		}
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	trigger: function trigger() {
		for (var id in vood.helperAdapter.requests) {
			if (vood.helperAdapter.requests[id].requestState === vood.helperAdapter.states.pending) {
				vood.helperAdapter.requests[id].requestState = vood.helperAdapter.states.sended;
				vood.helperAdapter.adapterImplementation.sendRequest(vood.helperAdapter.requests[id]);
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Collects pending requests and triggers this.sendRequest
	emit: function emit(id, response) {
		if (this.requests[id]) {
			this.requests[id].requestState = this.states.finished;
			vood.controllerHelper.call('*', '_checkRequest', [id, response]);
		} else {
			throw 'There was no request with id ' + id;
		}
	}
});

vood.helper = vood.Obj({});
////-----------------------------------------------------------------------------------------
// creating helper class
function helper(path, obj) {
	if (!app.helper) app.helper = {};
	if (app.helper[path]) {
		console.warn('The helper for ' + path + ' already exists');
	} else {
		app.helper[path] = vood.Obj('helper', path, obj);
	}
}

exports['default'] = helper;
exports['default'] = vood.Obj({
	////-----------------------------------------------------------------------------------------
	// returns helpers as an array, for better eventhandling at the viewhelper
	get: function get() {
		var result = [];
		for (var i in app.helper) {
			result.push(app.helper[i]);
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// gets called after the system startup, called by controllerHelper after all initial controller.model were loaded
	callInits: function callInits() {
		var result = [];
		for (var i in app.helper) {
			vood.utilHelper.safeCall(app.helper[i], 'init');
		}
		return result;
	}

});
exports['default'] = vood.Helper('router', {
	// Helper goes into userspace, because he propably wants to overwrite it
	events: [{
		action: 'change',
		type: 'hashchange'
	}, {
		action: 'changeUrl',
		type: 'route'
	}],
	////-----------------------------------------------------------------------------------------
	// how should the hash be formed?
	delimiter: '/',
	////-----------------------------------------------------------------------------------------
	// This init is called, when the application startup is done
	init: function init() {
		if (!this.changed) {
			this.change(location.hash); // @TODO make this work at server environment
		}
	},
	////-----------------------------------------------------------------------------------------
	// parses the hash and return the state
	getState: function getState() {
		var newUrl = location.hash.substring(1, location.hash.length);
		var parts = newUrl.split(this.delimiter);
		while (parts.length > 0 && parts[parts.length - 1] === '') {
			// Removes trailing slashes
			parts.pop();
		}

		return parts;
	},
	////-----------------------------------------------------------------------------------------
	// Can be called via this.trigger( 'changeUrl', ['foo', 'bar'])
	changeUrl: function changeUrl(parts) {
		var newHash = parts.join(this.delimiter);
		if (location.hash != '#' + newHash) {
			location.hash = newHash;
			return true;
		}
	},
	////-----------------------------------------------------------------------------------------
	// Tells the browser hash/state
	writeUrl: function writeUrl() {
		location.hash = this.getUrl();
	},
	////-----------------------------------------------------------------------------------------
	// tells the url of the state
	getUrl: function getUrl(state) {
		return state.join(this.delimiter);
	},
	////-----------------------------------------------------------------------------------------
	// listens to the hachchange event from the browser
	change: function change(hash) {
		this.triggerUrl(this.getState());
	},
	////-----------------------------------------------------------------------------------------
	// triggers events and checks if there was an listener for it, if not it triggers a /404
	triggerUrl: function triggerUrl(state) {
		this.changed = true;
		var result = null;
		var url = this.getUrl(state);
		if (url.length) {
			result = this.trigger('/' + url);
		} else {
			result = this.trigger('/');
		}
		if (result.length === 0) {
			this.trigger('/404');
		}
	}
});

var util = require('voodkit/util/helper')['default'];

var defaults = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Handles the internal registry for setters
		regs: [],
		////-----------------------------------------------------------------------------------------
		// Flag if an internal registry should be used
		registry: false,
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'content'
	},
	////-----------------------------------------------------------------------------------------
	// default initfunction
	init: function init() {},
	////-----------------------------------------------------------------------------------------
	// default destroyfunction, gets called before instance gets terminated
	// @TODO not yet implemented
	destroy: function destroy() {},
	////-----------------------------------------------------------------------------------------
	// metafunction for getting content
	get: function get(key, opt) {
		return this._handleData('get', key, null, opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for setting content, returns if value has changed and if it gets rendered
	set: function set(key, value, opt) {
		return this._handleData('set', key, value, opt);
	},
	////-----------------------------------------------------------------------------------------
	// adds runloopjobs with including uid of the jobs, for removage if controller gets destroyed
	addJob: function addJob(opt) {
		opt.uid = this._meta.uid;
		vood.utilRunloop.addJob(opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for setting content, returns if value has changed and if it gets rendered
	setAll: function setAll(value, opt) {
		var key = this._meta.contentSpace;
		if (!opt) opt = {};
		if (opt.contentSpace !== undefined) {
			key = opt.contentSpace;
		}
		opt.contentSpace = false; // Needs to be done, to don't get a prefix, but set the complete content

		return this._handleData('set', key, value, opt);
	},

	////-----------------------------------------------------------------------------------------
	// metafunction for pushing content, only for arrays
	push: function push(key, opt) {
		return this._handleData('push', key, null, opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for pushing content, return true when added to array, returns false when it was already added
	pushOnce: function pushOnce(key, value, opt) {
		return this._handleData('pushOnce', key, value, opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for pop index of an array/obj
	pop: function pop(key, value, opt) {
		return this._handleData('pop', key, value, opt);
	},
	////-----------------------------------------------------------------------------------------
	// handles all the events
	trigger: function trigger(type, evt, opt) {
		return vood.viewHelper.trigger(type, evt, opt);
	},
	////-----------------------------------------------------------------------------------------
	// metafunction for handling data-operations
	_handleData: function _handleData(type, key, value, opt) {
		if (!opt) {
			opt = {};
		}
		key = this._generateRealpath(key, opt);
		return this._handleRealData(type, key, value, opt);
	},
	////-----------------------------------------------------------------------------------------
	// Checks if this view has a fitting event-definition
	_checkForEvent: function _checkForEvent(type, evt, opt) {
		var result = { found: false, result: null };
		for (var i = 0; i < this.events.length; i++) {
			var eventDefinition = this.events[i];
			if (vood.viewHelper.checkEventMatch(eventDefinition.type, type, evt)) {
				// If not an pseudo-event selector has to fit
				var target = null;
				if (!opt.pseudo) {
					var parents = $(evt.target).parents(eventDefinition.selector);
					if ($(evt.target).is(eventDefinition.selector)) {
						target = $(evt.target);
					} else if (parents.length) {
						target = parents;
					} else {
						continue;
					}
				}
				var data = vood.viewHelper.getAttributes(target);
				// Sorry for doubled code
				if (this.controller && _.isFunction(this.controller[eventDefinition.action])) {
					result.found = true;
					if (opt.pseudo) {
						result.result = this.controller[eventDefinition.action](evt);
					} else {
						result.result = this.controller[eventDefinition.action](data, evt, target);
						if (result.result === false) evt.propagation = false;
					}
				}
				if (_.isFunction(this[eventDefinition.action])) {
					result.found = true;
					if (opt.pseudo) {
						result.result = this[eventDefinition.action](evt);
					} else {
						result.result = this[eventDefinition.action](data, evt, target);
						if (result.result === false) evt.propagation = false;
					}
				}
				if (!result.found) console.error('Found an eventdefinition ' + type + ' but the corresponding action ' + eventDefinition.action + ' was not found');
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// query management of data-handling
	_handleRealData: function _handleRealData(type, key, value, opt) {
		var keyParts = key.split('.');
		var partClone = _.clone(keyParts);
		var result = vood.objHelper.isQuery(key) ? [] : undefined;

		for (var i = 0; i < keyParts.length; i++) {
			var part = keyParts[i];
			var previous = partClone.slice(0, i);
			var lastKey = previous[previous.length - 1];

			if (vood.objHelper.isQuery(part)) {
				var obj = this._getReference(previous)[lastKey];
				for (var arrIndex in obj) {
					if (obj.hasOwnProperty(arrIndex) && vood.objHelper.isTrue(obj[arrIndex], part, opt.query)) {
						opt.addRegistry = false;
						partClone[i] = arrIndex;
						result.push(this._handleRealData(type, partClone.join('.'), value, opt));
					}
				}
				return result;
			} else if (i + 1 == keyParts.length) {
				return this._handleTypes(type, keyParts, value, opt);
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// actual handling of the data (without queries)
	_handleTypes: function _handleTypes(type, keyParts, value, opt) {
		var changed = opt.forceRender || false;
		var result = false;
		switch (type) {
			case 'get':
				// added cloneDeep to remove reference, when setter is made, we want a rerender not a reference
				result = _.cloneDeep(this._getReference(keyParts)[keyParts[keyParts.length - 1]]);
				break;
			case 'set':
				var current = this._getReference(keyParts)[keyParts[keyParts.length - 1]];
				if (current != value) {
					this._addReg(keyParts.join('.'), value, opt);
					this._getReference(keyParts)[keyParts[keyParts.length - 1]] = value;
					result = true;
					changed = true;
				}
				break;
			default:
				throw 'type ' + type + ' is not defined';
		}

		if (changed && this.view) {
			// Only rerender when its relevant to the template
			if (keyParts[0] === this._meta.contentSpace) {
				if (vood.viewHelper.dirtyHandling !== false) {
					this.view._meta.dirty = true;
				} else {
					this.view._render();
				}
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// Builds a registry-array
	_addReg: function _addReg(key, value, opt) {
		if (opt.addRegistry !== false) {
			var result = [];
			var later = [];
			var history = false;
			for (var i = 0; i < this._meta.regs.length; i++) {
				var register = this._meta.regs[i];
				if (key === register.key && history) {} else if (vood.objHelper.isKeyChild(key, register.key)) {
					if (opt.keepChilds) {
						later.push(register);
					}
				} else {
					result.push(register);
				}
			}
			result.push({ key: key, value: value, opt: opt });
			this._meta.regs = result.concat(later);
		}
	},
	////-----------------------------------------------------------------------------------------
	// handling of dotnotation, returns the last but one. creates objects if not existent
	_getReference: function _getReference(keyParts) {
		if (keyParts.length === 1) {
			// @FIXME whithout this hack, function returns null
			return this;
		} else {
			var content = this[keyParts[0]];
			for (var i = 1; i < keyParts.length; i++) {
				var part = keyParts[i];

				if (i == keyParts.length - 1) {
					return content; // sadly i cant return the property-value itself, reference would get lost
				}

				if (!content[part] && i + 1 < keyParts.length) {
					// @TODO Check for sideeffects -> === undefined was it before
					content[part] = {};
					content = content[part];
					console.info(keyParts.slice(0, i + 1).join('.') + ' did not exist, so I created it for you');
				} else {
					content = content[part];
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// adds (optional) prefix to path
	_generateRealpath: function _generateRealpath(key, opt) {
		if (opt.contentSpace === false) {
			return key;
		} else if (opt.contentSpace) {
			return opt.contentSpace + '.' + key;
		} else if (this._meta.contentSpace) {
			return this._meta.contentSpace + '.' + key;
		} else {
			return key;
		}
	}

};

var meta = function meta() {
	var obj = arguments[arguments.length - 1];
	var properties = _.cloneDeep(defaults);
	util.merge(obj, properties);
	if (arguments.length > 1) {
		obj._meta.type = arguments[0];
	}
	if (arguments.length > 2) {
		obj._meta.path = arguments[1];
	}
	return obj;
};

exports['default'] = meta;
exports['default'] = vood.Obj({
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, when nothing fits, first operator will be used
	logicOperators: [{
		delimiter: '&&',
		defaultValue: true
	}, {
		delimiter: '||',
		defaultValue: false
	}, {
		delimiter: '@each',
		defaultValue: true,
		skip: true
	}],
	////-----------------------------------------------------------------------------------------
	// First matching type is taken, so >= has to be in this array, before >
	types: ['==', '!=', '>=', '<=', '>', '<'],
	////-----------------------------------------------------------------------------------------
	// checks if object fits the query
	isTrue: function isTrue(obj, query, variables) {
		var type = this.getType(query);
		var result = type.defaultValue;
		if (type.skip) return result;
		var parts = query.split(type.delimiter);
		for (var partIndex = 0; partIndex < parts.length; partIndex++) {
			var queryParts = this.getLogicParts(parts[partIndex]);
			if (this.objCheck(obj, queryParts, variables) != type.defaultValue) {
				result = !result;
				break;
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// Returns variables which are in the query {variableName}
	getVariableName: function getVariableName(key) {
		if (key[0] == '{' && key[key.length - 1] == '}') {
			return key.slice(1, key.length - 1);
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks if querypart fits to corresponding object, when variables are used it checks them as an array
	objCheck: function objCheck(obj, query, variables) {
		var result = null;
		var variableName = this.getVariableName(query.value);
		var values = [query.value];
		if (variableName) {
			this.variableValidation(variableName, variables);
			values = variables[variableName];
		}
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			result = this.valueCompare(obj[query.key], value, query.type);
			if (result) break;
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// compares two values depending on the logicoperator-type
	valueCompare: function valueCompare(source, target, type) {
		var result = null;
		switch (type) {
			case '==':
				if (source === target) result = true;else result = false;
				break;
			case '!=':
				if (source !== target) result = true;else result = false;
				break;
			case '>=':
				if (source >= target) result = true;else result = false;
				break;
			case '<=':
				if (source <= target) result = true;else result = false;
				break;
			case '>':
				if (source > target) result = true;else result = false;
				break;
			case '<':
				if (source < target) result = true;else result = false;
				break;
			default:
				throw 'Type ' + type + ' is not implemented, please contact https://github.com/plusgut/vood/issues';
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// returns an object of query elements {key: key: type: '==', value: value}
	getLogicParts: function getLogicParts(query) {
		var delimiter = null;
		for (var i = 0; i < this.types.length; i++) {
			var type = this.types[i];
			if (query.indexOf(type) != -1) {
				var parts = query.split(type);
				if (parts.length != 2) throw 'Your logic operator was there mutliple times ' + query;
				return { key: parts[0], type: type, value: parts[1] };
			}
		}
		throw 'Your logic operator was not available ' + query;
	},
	////-----------------------------------------------------------------------------------------
	// decides wheather to use && or || and returns the defaultvalues of it
	getType: function getType(query) {
		var type = null;
		for (var i = this.logicOperators.length; i > 0; i--) {
			var logicOperator = this.logicOperators[i - 1];
			// Checks if delimter occours, or if its the last checkable object (for setting default)
			if (query.indexOf(logicOperator.delimiter) != -1 || i === 1 && !type) {
				if (type) throw 'You can not use multiple types';
				type = logicOperator;
			}
		}
		return type;
	},
	////-----------------------------------------------------------------------------------------
	// checks if the string is an query
	isQuery: function isQuery(key) {
		if (key.indexOf('=') !== -1 || key.indexOf('@') !== -1) {
			return true;
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks if all necessary values are correct
	variableValidation: function variableValidation(key, variables) {
		if (!variables || variables[key] === undefined) throw key + ' was not set in opt: {query: {}}';
		if (!_.isArray(variables[key])) throw key + ' query has to be an array';
	},
	////-----------------------------------------------------------------------------------------
	// checks if the key is a sub, needed for registry removal if parent gets set
	// @TODO
	isKeyChild: function isKeyChild(key, check) {
		return true;
	}
});

////-----------------------------------------------------------------------------------------
// Uppercases the first letter of an string
String.prototype.capitalize = function () {
	return this[0].toUpperCase() + this.slice(1, this.length);
};

var obj = {
	////-----------------------------------------------------------------------------------------
	// Merges an object inside an other, without overwriting
	merge: function merge(target, obj) {
		for (var index in obj) {
			if (obj.hasOwnProperty(index)) {
				if (!target[index]) {
					target[index] = obj[index];
				} else if (_.isObject(target[index]) && _.isObject(obj[index]) && !_.isFunction(target[index]) && !_.isFunction(obj[index])) {
					this.merge(target[index], obj[index]);
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// inserts text inside a string at position
	insertAt: function insertAt(src, position, str) {
		return src.substr(0, position) + str + src.substr(position);
	},
	////-----------------------------------------------------------------------------------------
	// Triggers e.g. init-functions, without breaking stuff. on debug mode it throws the errors
	safeCall: function safeCall(scope, func, args) {
		if (!args) args = [];
		if (app.debug) {
			return scope[func](args[0], args[1], args[2], args[3]); // @TODO make this dynamic without eval
		} else {
			try {
				return scope[func](args[0], args[1], args[2], args[3]); // @TODO make this dynamic without eval
			} catch (err) {
				console.error(err);
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// If you don't like slashes inside the namespace/module pattern, you can make your transition here
	transformNamespace: function transformNamespace(name) {
		return name;
	}
};

exports['default'] = window.vood ? vood.Obj(obj) : obj;
exports['default'] = vood.Obj({
	////-----------------------------------------------------------------------------------------
	// Active jobs-array
	jobs: [],
	////-----------------------------------------------------------------------------------------
	// How many miliseconds should triggering the jobs
	ticks: 10,
	////-----------------------------------------------------------------------------------------
	// Gets the runloop started
	init: function init() {
		this.loop();
	},
	////-----------------------------------------------------------------------------------------
	// Calls runloop jobs
	// @TODO call not every controller on each tick but depending on there interval
	// @TODO remove job when not needed
	loop: function loop() {
		for (var i = 0; i < this.jobs.length; i++) {
			// @TODO use safecall
			if (true) {
				this.jobs[i].callback();
			} else {
				try {
					this.jobs[i].callback();
				} catch (err) {
					console.log(this.jobs[i], err);
				}
			}
		}
		setTimeout(this.loop.bind(this), this.ticks);
	},
	////-----------------------------------------------------------------------------------------
	// add a job to the list
	// @TODO validation
	addJob: function addJob(job) {
		return this.jobs.push(job);
	}
});

var classContent = {
	_meta: {
		////-----------------------------------------------------------------------------------------
		// Just some debugging info
		type: 'view',
		////-----------------------------------------------------------------------------------------
		// Prefix where setter and getter should view
		contentSpace: 'controller.content'
	},
	////-----------------------------------------------------------------------------------------
	// array of eventdefinitions
	events: [],
	////-----------------------------------------------------------------------------------------
	// Gets triggered before template gets rendered
	construct: function construct() {},
	////-----------------------------------------------------------------------------------------
	// Gets triggered each time after the template got rerendered
	notify: function notify() {},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_triggerEvent: function _triggerEvent(func, data, event, target) {},
	////-----------------------------------------------------------------------------------------
	// handles replacement of content and triggers compile function
	_render: function _render() {
		this._meta.dirty = false;
		var startUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrStart + '=' + this.controller._meta.uid + ']';
		var begin = $(startUid);
		// @TODO remove subcontrollers
		while (this.obj('root').length > 1) {
			this.obj('root').last().remove(); // I want only one object to get replaced, else its possible to have the content dubled
		}
		if (this.obj('root').length === 0 && begin.length === 1) {
			// Needed, if the template had nothing to return previously
			begin.after('<span></span>'); // We shortly add a span to have an entrance point
		}
		this.obj('root').replaceWith(this._compile());
		vood.utilHelper.safeCall(this.controller, 'notify');
		vood.utilHelper.safeCall(this, 'notify');
	},
	////-----------------------------------------------------------------------------------------
	// Trigger jade compiler
	_compile: function _compile() {
		return vood.viewHelper.compile(this.controller._meta.path, this.controller.content);
	},
	////-----------------------------------------------------------------------------------------
	// Triggers compilefunction but adds script-tags with uid
	_compileComplete: function _compileComplete() {
		var id = this.controller._meta.uid;
		return vood.viewHelper.scriptStart(id, this._meta.path) + this._compile() + vood.viewHelper.scriptEnd(id);
	},
	////-----------------------------------------------------------------------------------------
	// returns jquery object depending selector
	obj: function obj(path) {
		var selector = null;
		var id = this.controller._meta.uid;
		var startUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrStart + '=' + id + ']';
		var endUid = vood.viewHelper.uidDomNode + '[' + vood.viewHelper.uidAttrEnd + '=' + id + ']';
		var root = $(startUid).nextUntil(endUid);
		if (path !== 'root') {
			if (!this[path]) {
				throw 'Couldnt get you the obj because of missing definition';
			}
			selector = this[path];
			return $.merge(root.filter(selector), root.children(selector)); // we want the top and the children
		} else {
			return root;
		}
	}
};

////-----------------------------------------------------------------------------------------
// Function for creating classes
function view(path, obj) {
	if (vood.viewHelper.list[path]) {
		console.warn('The View for ' + path + ' already exists');
	} else {
		vood.viewHelper.list[path] = vood.Obj('view', path, obj);
		vood.utilHelper.merge(vood.viewHelper.list[path], classContent);
	}
}

exports['default'] = view;

require('jade/runtime');

exports['default'] = vood.Obj({
	////-----------------------------------------------------------------------------------------
	// In which package does requirejs use the templates
	templatePrefix: 'templates/',
	////-----------------------------------------------------------------------------------------
	// object where all template functions are stored
	jst: {},
	////-----------------------------------------------------------------------------------------
	// Jquery selector where the this.startPath controller and view are added
	entrance: 'body',
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
	// Decides which instances are asked for handling events
	eventSpaces: ['controllerHelper', 'helperHelper'],
	////-----------------------------------------------------------------------------------------
	// JQuery events which the framework is listening for
	eventString: 'click submit change mouseover mouseout mousemove mouseup mousedown keyup keydown drag dragstart dragover mousewheel',
	////-----------------------------------------------------------------------------------------
	// maps e.g. keypresses to trigger shortevents for enter and escape-keys
	eventMap: {
		keyup: {
			keyCode: {
				13: 'enterkey',
				27: 'escapekey'
			}

		}
	},
	////-----------------------------------------------------------------------------------------
	// adds dirtychecking to runloop and inserts first view this.startPath and starts document event listener
	init: function init() {
		if (this.dirtyHandling !== false) {
			this.addJob({ callback: this.dirtyChecking });
		}
		this.checkValidity();
		this.insertTemplates();
		this.insertApp();
		this.addEvents();
	},

	////-----------------------------------------------------------------------------------------
	// creates instance of view
	create: function create(path, opt) {
		return this.getEntity(path);
	},
	////-----------------------------------------------------------------------------------------
	// searches for jade templates and adds to this.jst
	insertTemplates: function insertTemplates() {
		var seen = requirejs._eak_seen;
		for (var seenIndex in seen) {
			if (seenIndex.search(this.templatePrefix) === 0) {
				this.jst[seenIndex] = require(seenIndex)['default'];
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// inserts first view to this.entrance
	insertApp: function insertApp() {
		var result = vood.controllerHelper.create(this.startPath, null, {});
		var dom = $(this.entrance);
		if (dom.length === 1) {
			$(this.entrance).replaceWith(result.html);
		} else {
			console.error('vood.viewHelper.entrance was not represented in dom properly', dom);
		}
	},
	////-----------------------------------------------------------------------------------------
	// gets class and returns instance
	getEntity: function getEntity(path) {
		if (!this.list[path]) {
			console.log('View ' + path + ' does not exist');
			vood.View(path, { _meta: { pseudo: true } });
		}
		return _.cloneDeep(this.list[path]);
	},
	////-----------------------------------------------------------------------------------------
	// compiles the template with the corresponding content
	compile: function compile(path, content) {
		var name = this.templatePrefix + path;

		if (this.jst[name]) {
			return this.jst[name](content);
		} else {
			console.error(path + ' no such template');
			return '';
		}
	},
	////-----------------------------------------------------------------------------------------
	// start uid
	// @TODO move this to the templating engine
	scriptStart: function scriptStart(id, path) {
		return '<' + this.uidDomNode + ' ' + this.uidAttrStart + '="' + id + '" data-template="' + path + '"></' + this.uidDomNode + '>';
	},
	////-----------------------------------------------------------------------------------------
	// end uid
	scriptEnd: function scriptEnd(id) {
		return '<' + this.uidDomNode + ' ' + this.uidAttrEnd + '="' + id + '"></' + this.uidDomNode + '>';
	},
	////-----------------------------------------------------------------------------------------
	// some basic checking if values are correct
	checkValidity: function checkValidity() {
		if (!this.entrance) {
			throw 'App entrance is not defined';
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks which views are dirty, to asynchronoesly render them
	// @TODO
	dirtyChecking: function dirtyChecking() {},
	////-----------------------------------------------------------------------------------------
	// iterates through all dom-nodes to the top and returns an array of controllers
	getUids: function getUids(obj) {
		var result = [];
		var excludes = [];
		while (obj.length > 0) {
			// Needed handling with prev() instead of siblings(), to keep the order of the uids
			var prevObj = obj.prev();
			while (prevObj.length > 0) {
				var endUid = this.isUidEndObj(prevObj);
				var uid = this.isUidObj(prevObj);

				if (endUid) {
					excludes.push(endUid); // Needed to handle siblings, which do not surround the target
				} else if (uid && excludes.indexOf(uid) === -1) {
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
	isUidObj: function isUidObj(obj) {
		if (obj.is(this.uidDomNode + '[' + this.uidAttrStart + ']')) {
			return obj.attr(this.uidAttrStart);
		}
	},
	////-----------------------------------------------------------------------------------------
	// checks if dom-node is an uid-end-obj
	isUidEndObj: function isUidEndObj(obj) {
		if (obj.is(this.uidDomNode + '[' + this.uidAttrEnd + ']')) {
			return obj.attr(this.uidAttrEnd);
		}
	},
	////-----------------------------------------------------------------------------------------
	// adds all dom events which the framework ist listening for
	addEvents: function addEvents() {
		$('body').on(this.eventString, function (evt) {
			return vood.viewHelper.handleEvent(evt);
		});
		$(window).on('hashchange', function () {
			vood.viewHelper.trigger('hashchange', location.hash);
		});
	},
	////-----------------------------------------------------------------------------------------
	// wrapper for triggering events, selects corresponding parent-controllers
	handleEvent: function handleEvent(evt) {
		var uids = this.getUids($(evt.target));
		this.triggerExtra(evt);
		return this.trigger(evt.type, evt, { controllers: uids, pseudo: false });
	},
	////-----------------------------------------------------------------------------------------
	// handles all the events
	// @TODO move this to the eventhandler
	trigger: function trigger(type, evt, opt) {
		if (!evt) evt = {};
		if (type.search(':') != -1) throw 'events are not allowed to have a : inside';
		opt = this.prepareEventOpt(opt);
		var result = [];
		for (var i = 0; i < opt.controllers.length; i++) {
			var uid = opt.controllers[i];
			for (var spaceIndex = 0; spaceIndex < this.eventSpaces.length; spaceIndex++) {
				var controllers = vood[this.eventSpaces[spaceIndex]].get(uid);
				for (var controllerIndex = 0; controllerIndex < controllers.length; controllerIndex++) {
					var value = null;
					if (controllers[controllerIndex].view) {
						value = controllers[controllerIndex].view._checkForEvent(type, evt, opt);
					} else {
						value = controllers[controllerIndex]._checkForEvent(type, evt, opt);
					}
					if (value.found) result.push(value.result);
					if (!opt.pseudo && evt.propagation === false) break;
				}
				if (!opt.pseudo && evt.propagation === false) break;
			}
			if (!opt.pseudo && evt.propagation === false) break;
		}

		// Warn only when it either was a clickevent, or an pseudoevent
		if (!result.length && (opt.pseudo || !opt.pseudo && evt.type == 'click')) {
			console.warn('There was no eventdefinition found ' + type);
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// triggers eventmaps like keypresses to shortevents like "enterkey" and escapekey
	// @TODO make this deprecated
	triggerExtra: function triggerExtra(evt) {
		if (this.eventMap[evt.type]) {
			for (var index in this.eventMap[evt.type]) {
				var eventValue = evt[index];
				if (eventValue) {
					var mapValue = this.eventMap[evt.type][index][eventValue];
					if (mapValue) {
						this.trigger(mapValue, _.clone(evt));
					}
				}
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// Checks variables inside the eventdefition
	// @TODO make this deprecated, and move it to the view-class
	checkEventMatch: function checkEventMatch(definition, type, opt) {
		var reserved = ':';
		if (definition == type) {
			return true;
		} else {
			var pos = definition.search(reserved);
			var diff = 0;
			var params = {};
			while (pos != -1) {
				var leftoverDefinition = definition.substring(pos + 1, definition.length);
				var leftover = type.substring(pos, type.length);
				var lengthDefinition = leftoverDefinition.search(/\W/);
				var length = leftover.search(/\W/);
				if (lengthDefinition === -1) lengthDefinition = leftoverDefinition.length;
				if (length === -1) length = leftover.length;
				var key = leftoverDefinition.substring(0, lengthDefinition);
				var value = leftover.substring(0, length);
				var reg = new RegExp(':' + key);
				definition = definition.replace(reg, value);
				pos = definition.search(reserved);
				params[key] = value;
			}

			if (definition === type) {
				for (var i in params) {
					opt[i] = params[i];
				}
				return true;
			}
		}
	},
	////-----------------------------------------------------------------------------------------
	// recusively goes upside in the dom, to collect dataattributes
	getAttributes: function getAttributes(target, result) {
		if (!result) result = {};

		if (target) {
			var attributes = target[0].attributes;

			if (result.id === undefined && target.attr('id') && attributes['data-id'] === undefined) {
				result.id = target.attr('id');
			}

			var excludes = ['ember-extension'];

			for (var index in attributes) {
				if (attributes.hasOwnProperty(index)) {
					var name = attributes[index].name,
					    value = attributes[index].value;
					if (name && name.search('data-') === 0) {
						var key = name.replace(/data-/, '');
						if (result[key] === undefined && excludes.indexOf(key) == -1) {
							// SHould only overwrite when not set
							result[key] = value || null;
						}
					}
				}
			}
			var parent = target.parent();
			if (parent.length > 0) {
				result = this.getAttributes(parent, result);
			}
		}
		return result;
	},
	////-----------------------------------------------------------------------------------------
	// makes some default values for events
	prepareEventOpt: function prepareEventOpt(opt) {
		if (!opt) opt = {};
		if (opt.pseudo !== false) opt.pseudo = true;
		if (!opt.controllers) opt.controllers = ['*'];
		return opt;
	}
});
module.exports = exports['default'];
//# sourceMappingURL=vood.js.map
