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
var NOW = Date.now().toString();
function CDN(cdn) {
    var CDNLib = {
        'Ionic-css': '//cdn.bootcss.com/ionic/1.1.0/css/ionic.min.css',
        'Ionic-js': '//cdn.bootcss.com/ionic/1.1.0/js/ionic.bundle.min.js',
        'Angular-js': '//cdn.bootcss.com/angular.js/1.4.5/angular.min.js',
        'AngularUIRouter-js': '//cdn.bootcss.com/angular-ui-router/0.2.15/angular-ui-router.min.js',
        'LeanAnalytics-js': 'http://7xiv48.com1.z0.glb.clouddn.com/AV.analytics.min.js',
        'Avos-js': 'https://cdn1.lncld.net/static/js/av-core-mini-0.6.0.js',
        'Bootstrap-css': '//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css',
        'UIBootstrap-js': '//cdn.bootcss.com/angular-ui-bootstrap/0.13.3/ui-bootstrap.min.js',
        'UIBootstrapTpls-js': '//cdn.bootcss.com/angular-ui-bootstrap/0.13.3/ui-bootstrap-tpls.min.js'
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
            ['web/wechat/html/**/*.html', 'web/wechat/html/*.html'])
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                removeCommentsFromCDATA: true
            }))
            .pipe(templateCache({
                root: 'html/',
                module: 'APP'
            })),
        //合并app js
        gulp.src(['web/js/*.js', 'web/wechat/js/*.js', 'web/js/service/*.js', 'web/js/controller/*.js', 'web/wechat/js/service/*.js', 'web/wechat/js/controller/*.js', 'web/wechat/js/directive/*js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('index-' + NOW + '.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public/wechat'));
});

gulp.task('wechat_index', function () {
    return gulp.src('web/wechat/index.html')
        .pipe(htmlreplace(CDN({
            'Index-js': 'index-' + NOW + '.js'
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

/////////////////////////////////////// desktop ////////////////////////////////////////
gulp.task('desktop_js', function () {
    return es.concat(
        gulp.src(
            //把模板变成js
            ['web/desktop/html/**/*.html', 'web/desktop/html/*.html'])
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                removeCommentsFromCDATA: true
            }))
            .pipe(templateCache({
                root: 'html/',
                module: 'APP'
            })),
        //合并app js
        gulp.src(['web/js/*.js', 'web/desktop/js/*.js', 'web/js/service/*.js', 'web/js/controller/*.js', 'web/desktop/js/service/*.js', 'web/desktop/js/controller/*.js', 'web/desktop/js/directive/*js']))
        //angular依赖
        .pipe(ngAnnotate())
        .pipe(concat('index-' + NOW + '.js'))//合并
        .pipe(uglify({outSourceMap: false}))//压缩
        .pipe(gulp.dest('public/desktop'));
});

gulp.task('desktop_index', function () {
    return gulp.src('web/desktop/index.html')
        .pipe(htmlreplace(CDN({
            'Index-js': 'index-' + NOW + '.js'
        })))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true
        }))
        .pipe(gulp.dest('public/desktop'));
});

gulp.task('desktop', function () {
    gulp.start('desktop_js', 'desktop_index');
});

/////////////////////////////////////// default ////////////////////////////////////////
gulp.task('clear', function () {
    return gulp.src(['public/*'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['clear'], function () {
    gulp.start('image', 'wechat', 'desktop');
});
