/**
 * Created by wuhaolin on 7/26/15.
 */
"use strict";

var leanAnalytics = new _LeanAnalytics('desktop');
var APP = angular.module('APP', ['ui.bootstrap', 'ui.router']);
APP.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('book_recommend', {
        /**
         * @param:major 所有模块专门显示这个专业的书
         */
        url: '/book/recommend?major',
        views: {
            'main': {
                templateUrl: 'html/book/recommend.html'
            }
        }
    }).state('book_bookList', {
        /**
         * @param:cmd 当前模式 =tag时显示一类书 =need
         * 当cmd=tag 时用的表示显示哪一类型的书
         * 当cmd=major 显示一个专业的相关书
         * 当cmd=latest 显示最新的书
         * @param:title 当前View要显示的标题
         * @param:tag 当cmd=tag 时用的表示显示哪一类型的书
         */
        url: '/book/bookList?cmd&title&tag',
        views: {
            'main': {
                templateUrl: 'html/book/book-list.html'
            }
        }
    }).state('book_usedBookList', {
        /**
         * @param:cmd 当前模式 =near时显示你附近的二手书 =isbn时显示所有对应ISBN的二手书
         * @param:isbn13 当cmd=isbn时使用
         * @param:majorFilter 专业筛选
         */
        url: '/book/usedBookList?cmd&isbn13&majorFilter',
        views: {
            'main': {
                templateUrl: 'html/book/used-book-list.html'
            }
        }
    }).state('book_oneBook', {
        /**
         * @param:isbn13 一本书的isbn13号码
         */
        url: '/book/oneBook/:isbn13',
        views: {
            'main': {
                templateUrl: 'html/book/one-book.html'
            }
        }
    }).state('book_oneUsedBook', {
        /**
         * @param:usedBookAvosObjectId 二手书的AVOS ID
         */
        url: '/book/oneUsedBook/:usedBookAvosObjectId',
        views: {
            'main': {
                templateUrl: 'html/book/one-used-book.html'
            }
        }
    }).state('book_oneNeedBook', {
        /**
         * @param:usedBookAvosObjectId 二手书的AVOS ID
         */
        url: '/book/oneNeedBook/:usedBookAvosObjectId',
        views: {
            'main': {
                templateUrl: 'html/book/one-need-book.html'
            }
        }
    }).state('userHome', {
        /**
         * @param:ownerId 主人的AVOS ID
         */
        url: '/userHome/:ownerId',
        views: {
            'main': {
                templateUrl: 'html/tool/user-home.html'
            }
        }
    });
    $urlRouterProvider.otherwise('/book/recommend');
});
APP.run(function (User$) {
    User$.loginWithUnionId(readCookie('unionId'));
});