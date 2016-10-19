var gulp = require('gulp'),
    args = require('yargs').argv,
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    runSequence = require('run-sequence'),
    del = require('del'),
    globSass = require('gulp-sass-glob'),
    csslint = require('gulp-csslint'),
    open = require('gulp-open'),
    mozjpeg = require('imagemin-mozjpeg'),
    pngquant = require('imagemin-pngquant'),
    $ = require('gulp-load-plugins')({lazy: true});

// Configs gulp
var config = require('./gulp.config.js');


gulp.task('js-validate', () => {
  log('Analizing All Javascript Code of project with JSCS and JSHINT');

  return gulp
    .src(config.paths.scripts.scriptsValidate)
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jshint())
    .pipe($.jshint.reporter('gulp-jshint-html-reporter', {
      filename: config.paths.reportFolder + 'jshintReport.html'
    }))
    .pipe($.jshint.reporter('default'));
});

/**
 * Task to validate SCSS files
 */
gulp.task('scss-validate', () => {
  log('Analizing All SCSS Code of project with SCSS-lint');

  return gulp
    .src(config.paths.styles.stylesValidate)
    .pipe($.scssLint({
      maxBuffer: 307200,
      config: '.scss-lint.yml',
      filePipeOutput: 'scssReport.json'
    }))
    .pipe(gulp.dest(config.paths.reportFolder));
});

/**
 * Task to compilations
*/
gulp.task('styles', () => {
  log('Compiling SCSS to CSS...');

  return gulp
    .src(config.paths.styles.source + 'styles.scss')
    .pipe($.if(args.dev, $.sourcemaps.init()))
    .pipe(globSass())
    .pipe($.sass())
    .on('error', errorLogger)
    .pipe($.autoprefixer({browsers: ['last 2 versions', '> 5%']}))
    .pipe($.concat(config.paths.styles.filename))
    .pipe($.if(args.dev, $.sourcemaps.write()))
    .pipe(gulp.dest(config.paths.styles.destination));
});

/**
 * Task to move javascripts
*/
gulp.task('scripts', () => {
  return gulp
    .src(config.paths.scripts.source)
    .pipe($.if(args.dev, $.sourcemaps.init()))
    .pipe($.concat(config.paths.scripts.filename))
    .pipe($.if(!args.dev, $.uglify({mangle: false})))
    .pipe($.if(args.dev, $.sourcemaps.write()))
    .pipe(gulp.dest(config.paths.scripts.destination));
});

/**
 * Task to copy every fonts file on source folder
 */
gulp.task('fonts', () => {
  log('Copying font(s) ...');

  return gulp
    .src(config.paths.fonts.source + '**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(config.paths.fonts.destination));
});

/**
 * Task to compress every images file on source folder
 */
gulp.task('images', () => {
  log('Copying and compressing image(s) ...');

  return gulp
   .src([
      config.paths.images.source + '**/*.{png,jpg,jpeg,gif,svg,ico}'
    ])
    .pipe($.cache($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      use: [
        pngquant({quality: '65-80'}),
        mozjpeg({quality: 70})
      ]
    })))
    .pipe(gulp.dest(config.paths.images.destination));
});

/**
 * Task to watch 
 */

// Gulp Watch Styles
gulp.task('watch:styles', function () {
  gulp.watch(config.paths.styles.source, gulp.series('styles'));
});

// Gulp Watch Javascript
gulp.task('watch:js', function () {
  gulp.watch(config.paths.scripts.source, gulp.series('scripts'));
});

// Gulp Watch Images
gulp.task('watch:images', function () {
  gulp.watch(config.paths.images.source, gulp.series('images'));
});

// Gulp Watch everything
gulp.task('watch',
  gulp.parallel('watch:styles', 'watch:js', 'watch:images')
);

/**
 * Task to generate everything (production env)
 */
gulp.task('default',
  gulp.series(
    gulp.parallel('images', 'styles', 'fonts', 'scripts'),
    gulp.parallel('js-validate', 'scss-validate')
  )
);



/**
 * Funtion to help view in console
 * @param  {string} msg 'Text to identify rules'
 */
function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.green(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.green(msg));
  }
}

/**
 * Function to catch errors
 */
function errorLogger(error) {
  log('*** Start of Error(s) ***');
  log(error);
  log('*** End of Error(s) ***');
  this.emit('end');
}