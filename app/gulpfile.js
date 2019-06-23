const gulp = require('gulp')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const streamify = require('gulp-streamify')
const notify = require('gulp-notify')
const uglify = require('gulp-uglify-es').default

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')

gulp.task('sass', function() {
  return gulp.src('./sass/base.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"],
      cascade: false
    }))
    .pipe(gulp.dest('./'))
    .pipe(gulp.dest('../funige.github.io/namenote'))
//  .pipe(notify({title:'sass ok', sound:'Hero'}))
});

gulp.task('browser', function(done) {
  browserify('./src/browser.js', { debug: true })
    .transform(babelify, {presets: [['@babel/preset-env',
                                     { "useBuiltIns": "usage", "corejs": 2 }]]})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-browser.js'))
//  .pipe(streamify(uglify()))  // comment out when deguging
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../funige.github.io/namenote/dist'))
    .pipe(notify({title:'browser ok', sound:'Hero'}))

  gulp.src('base.css').
    pipe(gulp.dest('../funige.github.io/namenote'))
  gulp.src('index.html').
    pipe(gulp.dest('../funige.github.io/namenote'))
  gulp.src('js/lib/dictionary.js').
    pipe(gulp.dest('../funige.github.io/namenote/js/lib'))

  done();
});

gulp.task('desktop', function(done) {
  browserify('./src/desktop.js', { debug: true })
    .transform(babelify, {presets: [['@babel/preset-env',
                                     { "useBuiltIns": "usage", "corejs": 2 }]]})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-desktop.js'))
//  .pipe(streamify(uglify()))  // comment out when deguging
    .pipe(gulp.dest('./dist'))
  done();
});

gulp.task('build', gulp.parallel('browser', 'desktop', 'sass'));

gulp.task('default', function() {
  gulp.watch([
    'index.html',
    './sass/*.scss',
    './src/*.js',
    './js/lib/*.js',
    './*.js'
  ], gulp.task('build'))
});



