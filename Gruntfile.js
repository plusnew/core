module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var srcFileSelector = [
		'components/class.js',
		'components/handler.js',
		'core/class.js'
	];

	var tmpFileSelector = [];
	for(var i = 0; i < srcFileSelector.length; i++) {
		tmpFileSelector.push('tmp/' + srcFileSelector[i]);
	}

	grunt.initConfig({
		babel: {
			options: {
				presets: ["babel-preset-es2015"],
				plugins: ["transform-es2015-modules-amd"],
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
				src: 'dist/snew.js',
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
		'string-replace': {
			dist: {
				files: [{
					src: 'dist/snew.js',
					dest: 'dist/snew.js'
				}],
				options: {
					replacements: [{
						pattern: '}());',
						replacement: grunt.file.read('src/snew.js') + '}());'
					}]
				}
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
	grunt.registerTask('default', ['githooks', 'touch', 'babel', 'concat', 'amdclean', 'string-replace']);
	grunt.registerTask('min', ['clean', 'default', 'uglify']);
};

