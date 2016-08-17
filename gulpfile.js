var gulp = require('gulp');

var jade = require('gulp-jade');

var stylus = require('gulp-stylus');
var nib = require('nib');

var uglify = require('gulp-uglify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var autoprefixer = require('autoprefixer-stylus');

var concat = require('gulp-concat');

// Paths

var paths = {
    stylusEntry: './source/stylus/style.styl',
    stylusAll: './source/stylus/**/*.styl',
    jadeEntry: './source/template/*.jade',
    jadeAll: './source/templates/**/*.jade',
    jsAll: './source/scripts/**/*.js',
    jsEntry: './source/scripts/main.js',
    css: './site/css',
    js: './site/js',
    html: './site'
};

// Concat Js

gulp.task('scripts', function() {
  return gulp.src([paths.jsAll])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.js));
});


// Javascripts Compress
gulp.task('compressjs', function() {
  return gulp.src([paths.jsEntry,paths.jsAll])
    .pipe(uglify())
    .pipe(reload({stream: true}))
    .pipe(gulp.dest(paths.js));
});

// Jade Compile
gulp.task('jade2html', function() {
  gulp.src([paths.jadeEntry,paths.jadeAll])
    .pipe(jade({
      pretty: false
    }))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest(paths.html));
});

// Stylus Compile
gulp.task('stylus2css', function () {
  gulp.src([paths.stylusEntry])
    .pipe(stylus({
        use: [nib(), autoprefixer()],
        compress:true,
        'include css': true,
    }))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest(paths.css));
});

// Watch Files
gulp.task('serve', ['stylus2css', 'jade2html', 'compressjs'],function() {
  browserSync({
    server: {
      baseDir: './site'
    },
    open: false
  });
  gulp.watch([paths.jsEntry,paths.jsAll], ['compressjs']);
  //gulp.watch(paths.jsEntry, ['scripts']);
  gulp.watch([paths.stylusEntry,paths.stylusAll], ['stylus2css']);
  gulp.watch([paths.jadeEntry,paths.jadeAll], ['jade2html']);
});
