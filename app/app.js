app.init = function() {
	app.debug = true;
	////-----------------------------------------------------------------------------------------
	// vood.init() says the framework that your preparations are done, normally you don't need to do that
	// the parameter you give the init, will overwrite core properties/functions, normally you only overwrite the api-adapter and the dom-entrance
	vood.init({
		viewHelper: {
			dirtyHandling: false,
			entrance: '#app', // Defines on what entrance point the vood-container should be added
			startPath: 'main/app' // Defines which template should be compiled as the entrance
		}
	});
};

export default app;