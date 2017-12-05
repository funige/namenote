var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify')
var webserver = require('gulp-webserver');
var notify = require('gulp-notify')
var uglify = require('gulp-uglify')

gulp.task('browserify', function() {
  browserify('./es6/desktop.es6', { debug: true })
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-desktop.js'))
//  .pipe(streamify(uglify()))
    .pipe(gulp.dest('./js'))
    .pipe(notify({title:'ok', sound:'Hero'}))
});

gulp.task('watch', function() {
  gulp.watch(['./es6/*.es6', './js/lib/*.js', './*.js'], ['browserify'])

});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      host: '127.0.0.1',
      livereload: true
    })
  );
});

gulp.task('default', ['browserify', 'watch', 'webserver']);
