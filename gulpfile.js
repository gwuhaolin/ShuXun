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
var es = require("event-stream");
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');

function CDN(cdn) {
    var re = {
        'Wechat-js': 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
        'jQuery-js': 'http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js',
        'Avos-js': 'http://7xj22a.com1.z0.glb.clouddn.com/avos/av-mini.js',
        'Semantic-js': 'http://7xj22a.com1.z0.glb.clouddn.com/semantic/semantic.min.js',
        'Semantic-css': 'http://7xj22a.com1.z0.glb.clouddn.com/semantic/semantic.min.css',
        'Ionic-css': 'http://cdn.bootcss.com/ionic/1.0.0-rc.5/css/ionic.min.css',
        'Ionic-js': 'http://cdn.bootcss.com/ionic/1.0.0-rc.5/js/ionic.bundle.min.js'
    };
    for (var attrName in cdn) {
        if (cdn.hasOwnProperty(attrName)) {
            re[attrName] = cdn[attrName];
        }
    }
    return re;
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
    return gulp.src('src/wechat/img/*.*')
        .pipe(gulp.dest('public/wechat/img'));
});

//js文件合并压缩
gulp.task('wechat_js', function () {
    return es.concat(
        gulp.src(
            //把模板变成js
            ['src/wechat/temp/**/*.html', 'src/wechat/temp/*.html'])
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
        gulp.src(['src/wechat/js/my.js', 'src/wechat/js/app.js', 'src/wechat/js/service.js', 'src/wechat/js/controller.js', 'src/wechat/js/directive.js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public/wechat'));
});

//生成主页
gulp.task('wechat_index', function () {
    return gulp.src('src/wechat/index.html')
        .pipe(htmlreplace(CDN({
            'App-js': 'main.js'
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
    return gulp.src('src/desktop/img/*.*')
        .pipe(gulp.dest('public/desktop/img'));
});

gulp.task('desktop_index', function () {
    return gulp.src('src/index.html')
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
