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
function CDN(cdn) {
    var CDNLib = {
        'jQuery-js': 'http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js',
        'Avos-js': 'https://cdn1.lncld.net/static/js/av-core-mini-0.5.4.js',
        'Semantic-js': 'http://7xj22a.com1.z0.glb.clouddn.com/semantic/semantic.min.js',
        'Semantic-css': 'http://7xj22a.com1.z0.glb.clouddn.com/semantic/semantic.min.css',
        'Ionic-css': 'http://cdn.bootcss.com/ionic/1.0.0-rc.5/css/ionic.min.css',
        'Ionic-js': 'http://cdn.bootcss.com/ionic/1.0.0-rc.5/js/ionic.bundle.min.js',
        'Angular-js': 'http://cdn.bootcss.com/angular.js/1.4.0-rc.1/angular.min.js',
        'AngularUiRouter-js': 'http://cdn.bootcss.com/angular-ui-router/0.2.15/angular-ui-router.min.js'
    };
    return _.extend(CDNLib, cdn);
}

/////////////////////////////////////// image ////////////////////////////////////////
gulp.task('image', function () {
    gulp.src('web/img/*.*')
        .pipe(gulp.dest('public/img'));
    //复制favicon.ico到根目录
    gulp.src('web/img/favicon.ico')
        .pipe(gulp.dest('public/'));
});

/////////////////////////////////////// wechat ////////////////////////////////////////
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
        gulp.src(['web/js/*.js', 'web/wechat/js/*.js', 'web/js/service/*.js', 'web/wechat/js/controller/*.js', 'web/wechat/js/directive/*js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public/wechat'));
});

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
    gulp.start('wechat_js', 'wechat_index');
});

/////////////////////////////////////// homepage ////////////////////////////////////////
gulp.task('home', function () {
    return gulp.src('web/index.html')
        .pipe(htmlreplace(CDN()))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true
        }))
        .pipe(gulp.dest('public'));
});

/////////////////////////////////////// desktop ////////////////////////////////////////
gulp.task('desktop_js', function () {
    return es.concat(
        gulp.src(
            //把模板变成js
            ['web/desktop/temp/*.html', 'web/desktop/hbsPartial/*.html'])
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
        gulp.src(['web/js/*.js', 'web/desktop/js/*.js', 'web/js/service/*.js', 'web/desktop/js/controller/*.js', 'web/desktop/js/directive/*js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public/desktop'));
});

gulp.task('desktop_html', function () {
    return gulp.src('web/desktop/*/*.html')
        .pipe(htmlreplace(CDN({
            'Main-js': '../main.js'
        })))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true
        }))
        .pipe(gulp.dest('public/desktop/'));
});

gulp.task('desktop', function () {
    gulp.start('desktop_js', 'desktop_html');
});

/////////////////////////////////////// default ////////////////////////////////////////
gulp.task('clear', function () {
    return gulp.src(['public/*'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['clear'], function () {
    gulp.start('image', 'wechat', 'desktop', 'home');
});
