module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var srcFileSelector = [
		'helper/util.js',
		'obj/class.js',
		'obj/helper.js',
		'controller/class.js',
		'controller/helper.js',
		'helper/class.js',
		'helper/helper.js',
		'helper/eventsystem.js',
		'helper/router.js',
		'helper/runloop.js',
		'view/class.js',
		'view/helper.js',
		'template/class.js',
		'template/helper.js',
		'app.js',
	];

	var tmpFileSelector = [];
	for(var i = 0; i < srcFileSelector.length; i++) {
		tmpFileSelector.push('tmp/' + srcFileSelector[i]);
	}

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
		amdclean: {
			dist: {
				src: 'dist/snew.js',
				dest: 'dist/snew.js',
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
	grunt.registerTask('default', ['githooks', 'clean', 'touch', 'babel', 'concat', 'amdclean']);
	grunt.registerTask('min', ['clean', 'babel', 'uglify']);
};

