var gulp = require('gulp');
var chai = require('chai');
var Server = require('karma').Server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var path = require('path');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var eventStream = require('event-stream');

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

var sourceFiles = [
  path.join(sourceDirectory, '/**/*.js')
];
console.log("sourceFiles== "+ JSON.stringify(sourceFiles));

var lintFiles = [
  'gulpfile.js',
  // Karma configuration
  // 'karma-*.conf.js'
].concat(sourceFiles);


// Build JavaScript distribution files
gulp.task('build', function() {
  return eventStream.merge(gulp.src(sourceFiles))
    .pipe(plumber())
    .pipe(concat('angular-actioncable.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(ngAnnotate())
    .pipe(uglify({mangle: false}))
    .pipe(rename('angular-actioncable.min.js'))
    .pipe(gulp.dest('./dist/'));
});


// Validate source JavaScript
gulp.task('jshint', function () {
  gulp.src(lintFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Run everything
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test-src', 'build', done);
});

// watch for changes
gulp.task('watch', function () {
  // Watch JavaScript files
  gulp.watch([sourceFiles], ['process-all']);
});

// Run test once and exit
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

// Run test once and exit
gulp.task('default', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
