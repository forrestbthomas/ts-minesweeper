var gulp = require('gulp');
var ts = require('gulp-typescript');
var livereload = require('gulp-livereload');

 
gulp.task('compile', function () {
  var tsResult = gulp.src('minesweeper.ts')
    .pipe(ts({
        out: 'minesweeper.js'
      }));
  return tsResult.js
    .pipe(gulp.dest('./'))
    .pipe(livereload({ start: true, reloadPage: 'index.html' }));
});

gulp.task('default', ['compile'], function() {
  livereload.reload();
  gulp.watch('minesweeper.ts', ['compile']);
});