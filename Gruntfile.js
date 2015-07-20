module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var srcFileSelector = ['src/app.js', 'src/*/*'];
	var tmpFileSelector = ['src/app.js', 'src/*/*'];

	grunt.initConfig({
		babel: {
			all: {
				files: [{
					expand: true,
					src: srcFileSelector,
					dest: 'tmp'
				}]
			}
		},
		concat: {
			dist: {
				src: tmpFileSelector,
				dest: 'dist/vood.js'
			}
		},
		clean: {
			dist: {
				src: ['dist']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['clean', 'babel', 'concat']);
};
