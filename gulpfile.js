var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');  
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var colorRgbaFallback = require('postcss-color-rgba-fallback');
var opacity = require('postcss-opacity');
var pseudoelements = require('postcss-pseudoelements');
var vmin = require('postcss-vmin');
var pixrem = require('pixrem');
var willChange = require('postcss-will-change');
var sass = require('gulp-sass');
var path = require('path');
var cssnano = require('cssnano');
var zindex = require('postcss-zindex');
var removeComments = require('postcss-discard-comments');

// Define base folders
var asset_src = 'assets/';
var npm_src   = 'node_modules/';
var dest      = 'assets/';

gulp.task('fonts', function() {
    return gulp
        .src([
            npm_src   + 'font-awesome/fonts/**.*'
        ])
        .pipe(gulp.dest(dest + 'fonts'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp
        .src([
            npm_src   + 'jquery/dist/jquery.min.js',
            npm_src   + 'fitvids/fitvids.min.js',
            npm_src   + 'bootstrap/dist/js/bootstrap.min.js',
            npm_src   + 'lazysizes/lazysizes.min.js',
            asset_src + 'js/scripts/jquery.ghostHunter.js',
            asset_src + 'js/scripts/prism.js',
            asset_src + 'js/scripts/script.js'
        ])
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(dest + 'js'));
});

// Build styles from sass
gulp.task('sass', function () {
    var processors = [
        removeComments,
        cssnext({browsers:'> 1%, last 10 version, Firefox >= 20, ie >= 8', warnForDuplicates: false} ),
        zindex,
        willChange,
        colorRgbaFallback,
        opacity,
        pseudoelements,
        vmin,
        pixrem,
        cssnano
    ];

  return gulp
    .src(asset_src + '/sass/main.scss')
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest + 'css'));
});

// Watch for changes in files
gulp.task('watch', function() {
  // Watch .js files
  gulp.watch(asset_src + 'js/scripts/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch(asset_src + 'sass/*/*.sass', ['sass']);
 });

// Default Task
gulp.task('default', ['scripts', 'sass', 'watch']);
