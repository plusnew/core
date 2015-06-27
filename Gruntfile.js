module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var fileSelector = ['src/*', 'src/**/*'];

	grunt.initConfig({
		concat: {
			dist: {
				src: fileSelector,
				dest: 'tmp/concat.js'
			}
		},
		babel: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'dist/vood.js': 'tmp/concat.js'
				}
			}
		},
		watch: {
			scripts: {
				files: fileSelector,
				tasks: ['concat', 'babel']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'babel']);
};