module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		babel: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'dist/app.js': 'src/app.js'
				}
			}
		},
		watch: {
			scripts: {
				files: 'src/app.js',
				tasks: ['babel']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['babel']);
};