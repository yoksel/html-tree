var gulp = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var copy = require('gulp-copy');
var ghPages = require('gulp-gh-pages');
var colors = require('colors/safe');
var del = require('del');


gulp.task('css', function() {
  return gulp.src('src/scss/**/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

// WATCH FILES FOR CHANGES AND RELOAD
function watch () {
  browserSync({
    server: {
      baseDir: '.'
    }
  });


  gulp.watch(['src/scss/**/styles.scss'], gulp.series('css'));
  gulp.watch(['*.html', 'assets/css/**/*.css', 'assets/js/**/*.js'], {cwd: '.'}, gulp.series(reload));
}
gulp.task('serve', gulp.series(watch));

// CLEAN BUILD
gulp.task('clean', function(){
  del(['build/*']).then(paths => {
    console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
  });
});

function copy () {
  console.log(colors.magenta('⬤  Clear build/ and copy files to it... ⬤'));

  return gulp.src(['assets/**/*', '*.html'])
    .pipe(copy('build/'));
}

// CLEAN BUILD & COPY FILES TO IT
gulp.task('copy', gulp.series(['clean'], copy));

// PUBLISH TO GITHUB PAGES
function publish() {
  console.log(colors.rainbow('⬤  Publish to Github Pages... ⬤'));

  return gulp.src('build/**/*')
    .pipe(ghPages());
}

gulp.task('ghPages', gulp.series(publish));

gulp.task('default', function() {
  console.log(colors.rainbow('⬤  ================================ ⬤\n'));
  console.log('  AVAILABLE COMMANDS:');
  console.log('  ' + colors.cyan('-------------------\n'));
  console.log('  ' + colors.yellow('npm start') +
              ' — run local server with watcher');
  console.log('  ' + colors.green('npm run build') +
              ' — make build of the project');
  console.log('  ' + colors.cyan('npm run deploy') +
              ' — make build and publish project to Github Pages');
  console.log(colors.rainbow('\n⬤  ================================ ⬤'));
});




