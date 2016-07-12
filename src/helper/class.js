////-----------------------------------------------------------------------------------------
// creating helper class
function helper(path, obj) {
	if( !app.helper ) app.helper = {};
	if(app.helper[path]) {
		console.warn(`The helper for ${path} already exists`);
	} else {
		app.helper[path] = snew.Obj( 'helper', path, obj );
	}
	snew.eventsystem._addEvents(app.helper[path], path, 'helper');
}

export default helper;