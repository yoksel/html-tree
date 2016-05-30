var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var cssNano = require('gulp-cssnano');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var copy = require('gulp-copy');
var ghPages = require('gulp-gh-pages');
var colors = require('colors/safe');
var del = require('del');


gulp.task('sass', function() {
  return sass('src/scss/**/styles.scss')
    // .pipe(minifyCss())
    .pipe(gulp.dest('assets/css'))
});

// WATCH FILES FOR CHANGES AND RELOAD
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });


  gulp.watch(['src/scss/**/styles.scss'], ['sass']);
  gulp.watch(['*.html', 'assets/css/**/*.css', 'assets/js/**/*.js'], {cwd: '.'}, reload);
});

// CLEAN BUILD
gulp.task('clean', function(){
  del(['build/*']).then(paths => {
    console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
  });
});

// CLEAN BUILD & COPY FILES TO IT
gulp.task('copy', ['clean'], function() {
  console.log(colors.magenta('⬤  Clear build/ and copy files to it... ⬤'));

  return gulp.src(['assets/**/*', '*.html'])
    .pipe(copy('build/'));
});

// PUBLISH TO GITHUB PAGES
gulp.task('ghPages', function() {
  console.log(colors.rainbow('⬤  Publish to Github Pages... ⬤'));

  return gulp.src('build/**/*')
    .pipe(ghPages());
});




