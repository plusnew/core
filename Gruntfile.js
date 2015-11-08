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
				moduleRoot: 'snew'
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
				dest: 'dist/snew.js'
			}
		},
		uglify: {
			dist: {
				src: tmpFileSelector,
				dest: 'dist/snew.js'
			}
		},
		clean: {
			dist: {
				src: ['tmp', 'dist']
			}
		},

		watch: {
			scripts: {
				files: [
					'src/*',
					'src/*/*'
				],
				tasks: ['clean', 'babel', 'concat']
			}
		},
		githooks: {
			all: {
				'pre-commit': {
					taskNames: 'min'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['githooks', 'clean', 'babel', 'concat']);
	grunt.registerTask('min', ['clean', 'babel', 'uglify']);
};

