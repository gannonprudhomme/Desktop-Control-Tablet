const gulp = require('gulp')
const {series} = require('gulp')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload;

// Start BrowserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '/'
    }
  });
})

gulp.task('stuff', function() {
  gulp.src('').pipe(browserSync.stream());
})

gulp.task('sass:watch', function() {

})

gulp.task('default', function() {

})
