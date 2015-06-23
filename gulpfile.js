var path       = require('path')
  , gulp       = require('gulp')
  , uglify     = require('gulp-uglify')
  , stylus     = require('gulp-stylus');

gulp.task('build:stylus', function() {
  return gulp.src('styles/main.styl')
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
