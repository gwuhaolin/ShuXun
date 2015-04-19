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
var es = require("event-stream");
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');

//图片压缩
gulp.task('image', function () {
    return gulp.src('src/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/img'));
});

//js文件合并压缩
gulp.task('js', function () {
    return es.concat(
        gulp.src(
            //把模板变成js
            ['src/temp/**/*.html', 'src/temp/*.html'])
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(templateCache({
                root: 'temp/',
                module: 'APP'
            })),
        //合并app js
        gulp.src(['src/js/my.js', 'src/js/app.js', 'src/js/service.js', 'src/js/controller.js', 'src/js/directive.js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public'));
});

//生成主页
gulp.task('index', function () {
    return gulp.src('src/index.html')
        .pipe(htmlreplace({
            'AngularJS': 'main.js',
            'WechatJS': 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('public'));
});

gulp.task('default', function () {
    gulp.start('js', 'image', 'index');
});