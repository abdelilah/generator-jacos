var gulp = require('gulp');
var notify = require("gulp-notify");
var coffee = require("gulp-coffee");
var jshint = require('gulp-jshint');
var jsmin = require('gulp-jsmin');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var stylus = require('gulp-stylus');
var plumber = require('gulp-plumber');
var webserver = require('gulp-webserver');
var fs = require('fs-extra');
var _ = require('lodash');



var paths = {
  js: [
    <% for(var i = 0; i < js.length; i++){ %>
    '<%= js[i] %>',<% } %>
    'compiled/*.js',
  ],
  css: [
    <% for(var i = 0; i < css.length; i++){ %>
    '<%= css[i] %>',<% } %>
    'compiled/*.css'
  ],
  copy: <%= JSON.stringify(copy) %>
};





gulp.task('copy', function () {
    _.forEach(paths.copy, function(dest, src){
      fs.copySync(src, dest);
    });
});

gulp.task('watch', function () {
  livereload.listen();

  gulp.watch('coffee/*.coffee', ['coffee', 'scripts']);
  gulp.watch('stylus/*.styl', ['stylus', 'styles']);
  gulp.watch('jade/*.jade', ['jade']);
});

gulp.task('coffee', function () {
  return gulp.src('coffee/*.coffee')
      .pipe(plumber())
      .pipe(coffee({bare: true}))
      .pipe(jshint())
      .pipe(jsmin())
      .pipe(gulp.dest('compiled'));
});

gulp.task('scripts', ['coffee'], function(){
  return gulp.src(paths.js)
      .pipe(concat('script.min.js'))
      .pipe(gulp.dest('../build/assets/js/'))
      .pipe(notify("Compiled JS"))
      .pipe(livereload());
});

gulp.task('stylus', function () {
  return gulp.src('stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(minifyCSS())
    .pipe(gulp.dest('compiled'));
});

gulp.task('styles', ['stylus'], function(){
  return gulp.src(paths.css)
      .pipe(concat('style.min.css'))
      .pipe(gulp.dest('../build/assets/css/'))
      .pipe(notify("Compiled CSS"))
      .pipe(livereload());
});


gulp.task('jade', function () {
  return gulp.src('jade/*.jade')
      .pipe(plumber())
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest('../build'))
      .pipe(notify("Compiled HTML"))
      .pipe(livereload());
});



gulp.task('webserver', function() {
  return gulp.src('../build')
    .pipe(webserver({
      fallback: 'index.html',
      open: true
    }));
});




gulp.task('default', ['copy', 'styles', 'scripts', 'jade', 'watch', 'webserver']);
