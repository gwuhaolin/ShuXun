/**
 * Created by wuhaolin on 3/22/15.
 *
 */
"use strict";
var _ = require('underscore');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var es = require("event-stream");
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var CDNLib = require('./server/util/CDN.js');

function CDN(cdn) {
    return _.extend(CDNLib, cdn);
}

gulp.task('default', ['clear'], function () {
    gulp.start('wechat', 'desktop');
});

gulp.task('clear', function () {
    return gulp.src(['public/wechat', 'public/desktop', 'public/index.html'], {read: false})
        .pipe(clean());
});

///////////// wechat //////////////

//图片压缩
gulp.task('wechat_image', function () {
    return gulp.src('web/wechat/img/*.*')
        .pipe(gulp.dest('public/wechat/img'));
});

//js文件合并压缩
gulp.task('wechat_js', function () {
    return es.concat(
        gulp.src(
            //把模板变成js
            ['web/wechat/temp/**/*.html', 'web/wechat/temp/*.html'])
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                removeCommentsFromCDATA: true
            }))
            .pipe(templateCache({
                root: 'temp/',
                module: 'APP'
            })),
        //合并app js
        gulp.src(['web/wechat/js/util.js', 'web/wechat/js/app.js', 'web/wechat/js/service/*.js', 'web/wechat/js/controller/*.js', 'web/wechat/js/directive.js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public/wechat'));
});

//生成主页
gulp.task('wechat_index', function () {
    return gulp.src('web/wechat/index.html')
        .pipe(htmlreplace(CDN({
            'Main-js': 'main.js'
        })))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true
        }))
        .pipe(gulp.dest('public/wechat'));
});

gulp.task('wechat', function () {
    gulp.start('wechat_js', 'wechat_image', 'wechat_index');
});

///////////// desktop //////////////

//图片压缩
gulp.task('desktop_image', function () {
    return gulp.src('web/desktop/img/*.*')
        .pipe(gulp.dest('public/desktop/img'));
});

gulp.task('desktop_index', function () {
    return gulp.src('web/index.html')
        .pipe(htmlreplace(CDN()))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('desktop', function () {
    gulp.start('desktop_index', 'desktop_image');
});
