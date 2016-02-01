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
				dest: 'dist/snew.min.js'
			}
		},
		clean: {
			dist: {
				src: ['tmp', 'dist']
			}
		},
		touch: {
			src: ['dist/snew.min.js']
		},
		watch: {
			scripts: {
				files: [
					'src/*',
					'src/*/*'
				],
				tasks: ['default']
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
	grunt.registerTask('default', ['githooks', 'clean', 'touch', 'babel', 'concat']);
	grunt.registerTask('min', ['clean', 'babel', 'uglify']);
};

