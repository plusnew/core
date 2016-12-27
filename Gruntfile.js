// jshint varstmt: false
// jscs:disable requireTrailingComma

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var srcFileSelector = [
    'helpers/util.js',
    'view/class.js',
    'components/class.js',
    'components/handler.js',
    'helpers/runloop.js',
    'core/config.js',
    'core/class.js',
  ];

  var tmpFileSelector = [];
  for (var i = 0; i < srcFileSelector.length; i++) {
    tmpFileSelector.push('tmp/babel/' + srcFileSelector[i]);
  }

  grunt.initConfig({
    babel: {
      options: {
        moduleIds: true,
        sourceRoot: 'src',
        moduleRoot: 'snew',
      },
      all: {
        files: [{
          expand: true,
          cwd: 'src',
          src: srcFileSelector,
          dest: 'tmp/babel',
        }],
      },
    },
    concat: {
      dist: {
        src: tmpFileSelector,
        dest: 'tmp/concat/snew.js',
      },
    },
    uglify: {
      dist: {
        src: 'dist/snew.js',
        dest: 'dist/snew.min.js',
      },
    },
    clean: {
      dist: {
        src: ['tmp', 'dist']
      },
    },
    touch: {
      src: ['dist/snew.min.js']
    },
    watch: {
      src: {
        files: [
          'src/*',
          'src/**/*',
        ],
        tasks: ['babel', 'build'],
      },
      babel: {
        files: [
          'tmp/babel/*.js',
          'tmp/babel/**/*.js',
          'src/snew.js',
        ],
        tasks: ['build'],
      },
    },
    amdclean: {
      dist: {
        src: 'tmp/concat/snew.js',
        dest: 'tmp/concat/snew.js',
      },
    },
    'string-replace': {
      dist: {
        files: [{
          src: 'tmp/concat/snew.js',
          dest: 'dist/snew.js',
        }],
        options: {
          replacements: [{
            pattern: '}());',
            replacement: grunt.file.read('src/snew.js') + '}());',
          }]
        },
      },
    },
    coveralls: {
      options: {
        force: false
      },
      coverage: {
        src: 'test/coverage/*/lcov.info'
      }
    },
    githooks: {
      all: {
        'pre-commit': {
          taskNames: 'min',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('build', ['concat', 'amdclean', 'string-replace']);
  grunt.registerTask('default', [
    'githooks',
    'touch',
    'babel',
    'build',
  ]);
  grunt.registerTask('min', ['clean', 'default', 'uglify']);
};

