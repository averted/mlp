var path      = require('path')
  , gulp      = require('gulp')
  , uglify    = require('gulp-uglify')
  , stylus    = require('gulp-stylus')
  , nib       = require('nib')
  , bootstrap = require('bootstrap-styl');

gulp.task('build:stylus', function() {
  return gulp.src('styles/style.styl')
    .pipe(stylus({
      errors: true,
      compress: true,
      paths: ['.', 'styles'],
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('default', function() {
  gulp.start('build:stylus');
});
