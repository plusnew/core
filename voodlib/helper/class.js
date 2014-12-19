vood.helper = vood.Obj({});
////-----------------------------------------------------------------------------------------
// creating helper class
function helper( path, obj ){
	if(!app.helper) app.helper = {};
	app.helper[path] = vood.Obj( 'helper', path, obj );
}

export default helper;