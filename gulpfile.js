/**
 * Created by wuhaolin on 3/22/15.
 *
 */
"use strict";
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var angularFileSort = require('gulp-angular-filesort');

gulp.task('template', function () {
    return gulp.src(['src/temp/**/*.html', 'src/temp/*.html'])
        .pipe(templateCache())
        .pipe(gulp.dest('public'));
});

gulp.task('js', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(angularFileSort())
        .pipe(concat('main.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('public'));
});

gulp.task('default', function () {
    gulp.start('js', 'template');
});