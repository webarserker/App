var gulp = require('gulp')
var sass = require('gulp-sass')
var minifycss = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')

gulp.task("scss", function() {
    // gulp.src('./pages/**/*.scss')
    gulp.src(['./src/**/*.scss', '!node_modules/**/*'])
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src'))
})

gulp.task("watchsass", function() {
    gulp.watch('./**/*.scss', ['scss'])
})


gulp.task('default', ['watchsass'])
