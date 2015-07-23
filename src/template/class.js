
////-----------------------------------------------------------------------------------------
// Function for creating classes
function template( path, obj ){
	if( vood.templateHelper.list[ path ] ){
		console.warn( 'The Template for ' + path + ' already exists' );
	} else {
		vood.templateHelper.list[ path ] = obj;
	}
}

export default template;