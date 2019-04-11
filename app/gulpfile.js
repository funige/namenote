var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify')
var notify = require('gulp-notify')
var uglify = require('gulp-uglify')


gulp.task('browser', function(done) {
  browserify('./es6/browser.es6', { debug: true })
    .transform(babelify, {presets: [['@babel/preset-env',
                                    {"useBuiltIns": "usage"}]]})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-browser.js'))
//  .pipe(streamify(uglify()))  // comment out when deguging
    .pipe(gulp.dest('./js'))
    .pipe(gulp.dest('../funige.github.io/namenote/js'))
    .pipe(notify({title:'browser ok', sound:'Hero'}))

  gulp.src('style.css').
    pipe(gulp.dest('../funige.github.io/namenote'))
  gulp.src('index.html').
    pipe(gulp.dest('../funige.github.io/namenote'))
  gulp.src('js/lib/dictionary.js').
    pipe(gulp.dest('../funige.github.io/namenote/js/lib'))

  done();
});

gulp.task('desktop', function(done) {
  browserify('./es6/desktop.es6', { debug: true })
    .transform(babelify, {presets: [['@babel/preset-env',
                                    {"useBuiltIns": "usage"}]]})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-desktop.js'))
//  .pipe(streamify(uglify()))  // comment out when deguging
    .pipe(gulp.dest('./js'))
    .pipe(notify({title:'desktop ok', sound:'Hero'}))
  done();
});

gulp.task('build', gulp.parallel('browser', 'desktop'));

gulp.task('default', function() {
  gulp.watch(['index.html',
              './style.css',
              './es6/*.es6',
              './js/lib/*.js', './*.js'], gulp.task('build'))
});



