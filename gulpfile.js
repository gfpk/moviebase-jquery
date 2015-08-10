var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver');

gulp.task('js', function() {
  gulp.src('public/js/**/*')
});

gulp.task('assets', function() {
  gulp.src('public/assets/**/*')
});

gulp.task('data', function() {
  gulp.src('public/data/**/*')
});

gulp.task('fonts', function() {
  gulp.src('public/fonts/**/*')
});

gulp.task('html', function() {
  gulp.src('public/*.html')
});

gulp.task('partials', function() {
  gulp.src('public/partials/*.html')
});

gulp.task('css', function() {
  gulp.src('public/css/*.css')
});

gulp.task('watch', function() {
  gulp.watch('public/js/**/*', ['js']);
  gulp.watch('public/css/*.css', ['css']);
  gulp.watch('public/assets/*.*', ['assets']);
  gulp.watch('public/data/*.json', ['data']);
  gulp.watch('public/fonts/*.*', ['fonts']);
  gulp.watch(['public/partials/*.html'], ['partials']);
});

gulp.task('webserver', function() {
  gulp.src('public')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['watch', 'assets','data','fonts', 'html', 'js', 'css','partials', 'webserver']);
