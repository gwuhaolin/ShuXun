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
var streamqueue = require('streamqueue');
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var NOW = Date.now().toString();
function CDN(cdn) {
    var CDNLib = {
        'Ionic-css': 'http://cdn.bootcss.com/ionic/1.1.0/css/ionic.min.css',
        'Ionic-js': 'http://cdn.bootcss.com/ionic/1.1.0/js/ionic.bundle.min.js',
        'Angular-js': 'http://cdn.bootcss.com/angular.js/1.4.5/angular.min.js',
        'AngularUIRouter-js': 'http://cdn.bootcss.com/angular-ui-router/0.2.15/angular-ui-router.min.js',
        'LeanAnalytics-js': 'http://ou8vcvyuy.bkt.clouddn.com/AV.analytics.js',
        'Avos-js': 'https://cdn1.lncld.net/static/js/av-core-mini-0.6.0.js',
        'Bootstrap-css': 'http://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css',
        'UIBootstrap-js': 'http://cdn.bootcss.com/angular-ui-bootstrap/0.13.3/ui-bootstrap.min.js',
        'UIBootstrapTpls-js': 'http://cdn.bootcss.com/angular-ui-bootstrap/0.13.3/ui-bootstrap-tpls.min.js'
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

    function js() {
        return gulp.src([
            'web/js/*.js',
            'web/wechat/js/*.js',
            'web/js/service/*.js',
            'web/js/controller/**/*.js',
            'web/wechat/js/service/*.js',
            'web/wechat/js/controller/**/*.js',
            'web/wechat/js/directive/*js'])
            .pipe(ngAnnotate());//angular依赖
    }

    function html() {
        return gulp.src(
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
            }));
    }

    return streamqueue({objectMode: true}, js(), html())
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

    function js() {
        return gulp.src([
            'web/js/*.js',
            'web/desktop/js/*.js',
            'web/js/service/*.js',
            'web/js/controller/**/*.js',
            'web/desktop/js/service/*.js',
            'web/desktop/js/controller/**/*.js',
            'web/desktop/js/directive/*js'])
            .pipe(ngAnnotate());//angular依赖
    }

    function html() {
        return gulp.src(
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
            }));
    }

    return streamqueue({objectMode: true}, js(), html())
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

/////////////////////////////////////// clear ////////////////////////////////////////
gulp.task('clear', function () {
    return gulp.src(['public/*'], {read: false})
        .pipe(clean());
});

/////////////////////////////////////// static ////////////////////////////////////////
gulp.task('static', function () {
    return gulp.src('static/*')
        .pipe(gulp.dest('public/'));
});

/////////////////////////////////////// default ////////////////////////////////////////
gulp.task('default', ['clear'], function () {
    gulp.start('image', 'wechat', 'desktop', 'static');
});
