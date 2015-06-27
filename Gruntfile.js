module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var fileSelector = ['./src/*', './src/**/*'];

	grunt.initConfig({
		concat: {
			dist: {
				src: fileSelector,
				dest: 'tmp/concat.js'
			}
		},
		browserify: {
			options: {
				debug: true
			},
			dist: {
				options: {
					debug: true,
					transform: [
						["babelify", {loose: "all"}]
					],
				},
				files: {
					'./dist/vood.js': fileSelector
				}
			}
		},
		clean: {
			dist: {
				src: ['dist']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['clean', 'browserify']);
};