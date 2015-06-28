module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var fileSelector = ['./src/*', './src/**/*'];

	grunt.initConfig({
		browserify: {
			dist: {
				options: {
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
	grunt.registerTask('default', ['browserify']);
};
