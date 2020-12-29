'use strict';

const {src, dest, series, watch} = require('gulp');
const sass         = require('gulp-sass');
const gutil        = require('gulp-util');
const jshint       = require('gulp-jshint');
const clean        = require('gulp-clean');
const csso         = require('gulp-csso');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const rtlcss       = require('gulp-rtlcss');
const rename       = require("gulp-rename");
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const imagemin     = require('gulp-imagemin');
const fileinclude  = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const gulpif       = require('gulp-if');
const argv         = require('minimist')(process.argv.slice(2));
const browserSync  = require('browser-sync').create();

const path         = {
      html         : 'src/*.html',
      htminc       : 'src/_inc/**/*.htm',
      incdir       : 'src/_inc/',
      plugins      : 'src/assets/plugins/**/*.*',
      js           : 'src/assets/js/*.*',
      scss         : 'src/assets/scss/**/*.scss',
      img          : 'src/assets/img/**/*.+(png|jpg|gif)'
};

const destination  = (argv.pub) ? 'build/publish/' : 'build/development/';

const assets       = destination + 'assets/';

const sourcemap    = (argv.pub) ? false : true;

const port         = (argv.pub) ? 8003 : 8001;


/* =====================================================
    CLEAN
    ===================================================== */

const cleanit = function() {
  return src(destination, {read: false, allowEmpty: true})
  .pipe(clean());
}


/* =====================================================
    HTML
    ===================================================== */

const html = function() {
  return src( path.html )
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({ basepath: path.incdir }))
    .pipe(dest(destination))
    .pipe(browserSync.reload({
      stream: true
    }));
};


/* =====================================================
    SCSS
    ===================================================== */

const scss = function() {
  const ignoreNotification = false;
  return src( path.scss )
    .pipe(customPlumber('Error Running Sass'))
    // sourcemaps for Development
    .pipe(gulpif(sourcemap, sourcemaps.init()))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(argv.pub, csso({
        restructure: false,
        sourceMap: true,
        debug: true
    })))
    .pipe(gulpif(sourcemap, sourcemaps.write('.')))
    .pipe(dest(assets + 'css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};


const rtl = function() {
  const ignoreNotification = false;
  return src(assets + 'css/kidz.css')
    .pipe(customPlumber('Error Running RTL'))
    .pipe(rtlcss())
    .pipe(rename({ suffix: '.rtl' }))
    .pipe(dest(assets + 'css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};


/* =====================================================
    JS
    ===================================================== */

const js = function() {
  return src( path.js )
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .on('error', gutil.log)
    .pipe(gulpif(argv.pub, uglify()))
    .pipe(dest(assets + 'js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};


/* =====================================================
    IMAGE
    ===================================================== */

const img = function() {
  return src( path.img )
    .pipe(gulpif(argv.pub , imagemin({ progressive: true })))
    .pipe(dest(assets + 'img/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};


/* =====================================================
    PLUGINS
    ===================================================== */

const plugins = function() {
  return src( path.plugins )
    .pipe(dest(assets + 'plugins/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};


/* =====================================================
    ERROR MESSAGE
    ===================================================== */

function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass"
    })
  });
};


/* =====================================================
    BUILD
    ===================================================== */

const build = series(cleanit, html, scss, js, img, plugins, rtl);
exports.build = build;


/* =====================================================
    WATCH
    ===================================================== */

const watcher = function() {
  watch(path.html, html);
  watch(path.htminc, html);
  watch(path.scss, scss);
  watch(path.js, js);
  watch(path.img, img);
  watch(assets + 'css/kidz.css', rtl);
  browserSync.init({
    server: {
      baseDir: destination
    },
    port: port
  });
};


/* =====================================================
    TASKS
    ===================================================== */

exports.default = series(build, watcher);


/* =====================================================
    COMMANDS
    ===================================================== */

// gulp         : Development
// gulp build   : Build without watch
// gulp build --pub   : Build for publish with minified files
