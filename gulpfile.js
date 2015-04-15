/**
 * Created by wuhaolin on 3/22/15.
 *
 */
"use strict";
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var imagemin = require('gulp-imagemin');

gulp.task('image', function () {
    return gulp.src('src/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/img'));
});

gulp.task('template', function () {
    return gulp.src(['src/temp/**/*.html', 'src/temp/*.html'])
        .pipe(templateCache({
            root: 'temp/',
            module: 'APP'
        }))
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest('public'));
});

gulp.task('js', function () {
    return gulp.src(['src/js/my.js', 'src/js/app.js', 'src/js/service.js', 'src/js/controller.js', 'src/js/directive.js'])
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest('public'));
});

gulp.task('default', function () {
    gulp.start('js', 'template', 'image');
});