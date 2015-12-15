////-----------------------------------------------------------------------------------------
// Function for creating classes
function template(path, obj) {
	if( snew.templateHelper.list[ path ] ){
		console.warn(`The Template for ${path} already exists`);
	} else {
		snew.templateHelper.list[ path ] = obj;
	}
}

export default template;