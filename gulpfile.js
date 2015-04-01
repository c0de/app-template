var fs            = require('fs'),
    path          = require('path'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    concat        = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache'),
    minifyHtml    = require('gulp-minify-html'),
    ngmin         = require('gulp-ngmin'),
    uglify        = require('gulp-uglify'),
    minifyCss     = require('gulp-minify-css')
    gulpif        = require('gulp-if'),
    less          = require('gulp-less'),
    clean         = require('gulp-clean'),
    jshint        = require('gulp-jshint'),
    print         = require('gulp-print'),
    stylish       = require('jshint-stylish');
    
var BASE 					= 'app'
    ENTRY_FILE		= BASE + '/app/index.html'
		NPM_BASE			= 'node_modules'
		DESTINATION		= 'www';

var appFiles      = [BASE + '/app/app.js', BASE + '/**/*.js'],
    templateFiles = [BASE + '/**/*.html', '!'+ ENTRY_FILE],
    lessFiles     = [
      BASE + '/app/app.less',
      NPM_BASE + '/bootstrap/less/bootstrap.less'],
    libFiles      = [
      NPM_BASE + '/jquery/dist/jquery.min.js',
      NPM_BASE + '/angular/angular.min.js',
      NPM_BASE + '/angular-ui-router/release/angular-ui-router.min.js'],
    mapFiles      = [
      NPM_BASE + '/jquery/dist/*.map',
      NPM_BASE + '/angular/*.map'];

var compile = gutil.env.compile;

gulp.task('default', ['build'], function() {
  if (compile) return;
  return gulp.start('watch');
});

gulp.task('build', ['clean'], function() {
  return gulp.start('app', 'lib', 'map', 'templates', 'less', 'entry');
})

gulp.task('clean', function() {
  return gulp.src(DESTINATION + '/**/*', { read: false })
    .pipe(clean({force: true}));
});

gulp.task('watch', function() {
  gulp.watch([appFiles],      ['app']);
  gulp.watch([templateFiles], ['templates']);
  gulp.watch([libFiles],      ['lib']);
  gulp.watch([lessFiles, BASE + '/**/*.less'], ['less']);
  gulp.watch([ENTRY_FILE],    ['entry']);
});

gulp.task('app', function() {
    gulp.src(DESTINATION + '/js/main.js', { read: false })
      .pipe(clean({force: true}));

    gulp.src(appFiles)
      .pipe(jshint({
        strict: false,
        laxbreak: true,
        debug: true,
        globals: {
          angular: true,
          $: true,
          _: true
        }
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(concat('main.js'))
    .pipe(gulpif(compile, ngmin()))
    .pipe(gulpif(compile, uglify()))
    .pipe(gulp.dest(DESTINATION + '/js'));
});

gulp.task('templates', function() {
  gulp.src(DESTINATION + '/js/templates.js', { read: false })
    .pipe(clean({force: true}));

  gulp.src(templateFiles)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(templateCache({
      module: 'myApp',
      root: '',
      base: function(file) {
        return 'templates/' + path.basename(file.relative);
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulpif(compile, ngmin()))
    .pipe(gulpif(compile, uglify()))
    .pipe(gulp.dest(DESTINATION + '/js'));
});

gulp.task('lib', function() {
  gulp.src(DESTINATION + '/js/lib.js', { read: false })
    .pipe(clean({force: true}));
    
  gulp.src(libFiles)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(DESTINATION + '/js'));
});

gulp.task('map', function() {
  gulp.src(mapFiles)
    .pipe(gulp.dest(DESTINATION + '/js'));
});

gulp.task('less', function() {
  gulp.src(lessFiles)
    .pipe(less())
    .pipe(gulpif(compile, minifyCss()))
    .pipe(gulp.dest(DESTINATION + '/css'));
});

gulp.task('entry', function() {
  gulp.src(ENTRY_FILE)
    .pipe(gulp.dest(DESTINATION + '/'));
});
