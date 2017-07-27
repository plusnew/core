const gulp       = require('gulp');
const browserify = require('browserify');
const watchify   = require('watchify');
const source     = require('vinyl-source-stream');
const tsify      = require('tsify');
const gutil      = require('gulp-util');
const coveralls  = require('gulp-coveralls');

function getBrowserifyConfig() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['index.ts'],
    cache: {},
    packageCache: {},
  });
}

function bundle(config) {
  return config.plugin(tsify)
               .bundle()
               .pipe(source('snew.js'))
               .pipe(gulp.dest('dist'));
}

gulp.task('default', function () {
  return bundle(getBrowserifyConfig());
});

gulp.task('watch', function () {
  const watchedBrowserify = watchify(getBrowserifyConfig());
  watchedBrowserify.on('update', bundle.bind(null, watchedBrowserify));
  watchedBrowserify.on('log', gutil.log);

  return bundle(watchedBrowserify);
});

gulp.task('coveralls', function () {
  return gulp.src('test/coverage/**/lcov.info')
             .pipe(coveralls());
});
