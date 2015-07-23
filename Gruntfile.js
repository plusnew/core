module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var srcFileSelector = ['app.js', '*/*'];
	var tmpFileSelector = ['tmp/app.js', 'tmp/*/*'];

	grunt.initConfig({
		babel: {
			options: {
				modules: 'amd',
				moduleIds: true,
				sourceRoot: 'src',
				moduleRoot: 'vood'
			},
			all: {
				files: [{
					expand: true,
					cwd: 'src',
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
				src: ['tmp', 'dist']
			}
		},

		watch: {
			scripts: {
				files: srcFileSelector,
				tasks: ['clean', 'babel', 'concat']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['clean', 'babel', 'concat']);
};
