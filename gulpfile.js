const browserify = require('browserify')
const gulp = require('gulp')
const watchify = require('watchify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const streamify = require('gulp-streamify')
const notify = require('gulp-notify')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')

global.isWatching = true;

let count = {}

gulp.task('browser', function() {
  let bundler = browserify({
    entries: './src/browser.js',
    transform: [ babelify ],
    cache: {}, packageCache: {}, fullPaths: true, debug: true
  });

  let bundle = function() {
    startBundle('browser')
    return bundler
      .bundle()
      .pipe(source('bundle-browser.js'))
      .pipe(gulp.dest('./dist'))
      .pipe(gulp.dest('../funige.github.io/namenote/dist'))
      .on('end', function() {
        endBundle('browser');
      })

  }
  if (global.isWatching) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);

  } else console.log('not watching..');
  return bundle();
});

gulp.task('desktop', function() {
  let bundler = browserify({
    entries: './src/desktop.js',
    transform: [ babelify ],
    cache: {}, packageCache: {}, fullPaths: true, debug: true
  });

  let bundle = function() {
    startBundle('desktop')
    return bundler
      .bundle()
      .on('error', function(err) {
        notify({title:'Namenote', message:'Error...', sound:'Hero'}).write('');
        console.log("Error: " + err.message);
      })
      .pipe(source('bundle-desktop.js'))
      .pipe(gulp.dest('./dist'))
      .pipe(gulp.dest('../funige.github.io/namenote/dist'))
      .on('end', function() {
        endBundle('desktop');
        notify({title:'Namenote', message:'Success!!'}).write('');
      })
  }
  if (global.isWatching) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);

  } else console.log('not watching..');
  return bundle();
});
          
gulp.task('watch-sass', function() {
  gulp.watch([ './sass/*scss' ], gulp.task('sass'))
});

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
    .on('error', function(err) {
      console.log("Error: " + err.message);
    })
});

/*
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
*/


gulp.task('default', gulp.parallel('browser', 'desktop', 'watch-sass'));


function localTime() {
  const date = new Date();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return [hours, minutes, seconds].join(':');
}

function startBundle(name) {
  count[name] = new Date();
  console.log(`[${localTime()}] Starting '${name}'...`)
}

function endBundle(name) {
  const interval = new Date() - count[name];
  const time = Math.round(interval / 1000) + ' s';
  console.log(`[${localTime()}] Finished '${name}' after ${time}`);
}

