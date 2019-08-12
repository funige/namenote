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

let isSuccess;

gulp.task('sass', function() {
  isSuccess = true;
  return gulp.src('./sass/base.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../funige.github.io/namenote/dist'))
});

gulp.task('browser', function() {
  return browserify('./src/browser.js', { transform: [babelify] })
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
      isSuccess = false;
      this.emit('end');
    })
    .pipe(source('bundle-browser.js'))
//  .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../funige.github.io/namenote/dist'))
});

gulp.task('desktop', function() {
  return browserify('./src/desktop.js', { transform: [babelify] })
    .bundle()
    .on("error", function (err) {
      isSuccess = false;
      console.log("Error : " + err.message);
      this.emit('end');
    })
    .pipe(source('bundle-desktop.js'))
//  .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist'))
    
});

gulp.task('finish', function(done) {
  gulp.src('js/lib/dictionary.js')
    .pipe(gulp.dest('../funige.github.io/namenote/js/lib'))
  gulp.src('index.html')
    .pipe(gulp.dest('../funige.github.io/namenote'))

  // notify when build finished
  if (isSuccess) {
    notify({title:'Namenote', message:'Success!!', sound:'Hero'}).write('');
  } else {
    notify({title:'Namenote', message:'Error...', sound:'Sosumi'}).write('');
  }
  done();
});


////////////////////////////////////////////////////////////////

gulp.task('build', gulp.series(
  gulp.parallel('browser', 'desktop', 'sass'),
  'finish',
));

gulp.task('default', function() {
  gulp.watch([
    './package.json',
    './index*.html',
    './sass/*.scss',
    './src/*.js',
    './js/lib/*.js',
    './*.js'
  ], gulp.task('build'))
});



