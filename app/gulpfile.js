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
      cascade: false
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('browser', function() {
  return browserify('./src/browser.js', { debug: true })
    .transform(babelify) //, {presets: [['@babel/preset-env', { "useBuiltIns": "usage", "corejs": 2 }]]})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-browser.js'))
//  .pipe(streamify(uglify()))  // comment out when deguging
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../funige.github.io/namenote/dist'))
});

gulp.task('desktop', function() {
  return browserify('./src/desktop.js', { debug: true })
    .transform(babelify) //, {presets: [['@babel/preset-env', { "useBuiltIns": "usage", "corejs": 2 }]]})
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle-desktop.js'))
//  .pipe(streamify(uglify()))  // comment out when deguging
    .pipe(gulp.dest('./dist'))
});

gulp.task('finish', function(done) {
  gulp.src('base.css')
    .pipe(gulp.dest('../funige.github.io/namenote'))
  gulp.src('js/lib/dictionary.js')
    .pipe(gulp.dest('../funige.github.io/namenote/js/lib'))
  gulp.src('index.html')
    .pipe(gulp.dest('../funige.github.io/namenote'))

  // notify when build finished
  notify({title:'Namenote', message:'build finished!', sound:'Hero'}).write('');
  done();
});


////////////////////////////////////////////////////////////////

gulp.task('build', gulp.series(
  gulp.parallel('browser', 'desktop', 'sass'),
  'finish',
));

gulp.task('default', function() {
  gulp.watch([
    'index.html',
    './sass/*.scss',
    './src/*.js',
    './js/lib/*.js',
    './*.js'
  ], gulp.task('build'))
});



