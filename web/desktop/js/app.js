/**
 * Created by wuhaolin on 7/26/15.
 */
"use strict";

var leanAnalytics = new _LeanAnalytics('desktop');
var APP = angular.module('APP', ['ui.bootstrap', 'ui.router']);
APP.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.hashPrefix('!');
    $stateProvider
        .state('common', {
            url: '/common',
            abstract: true,
            template: '<ui-view/>'
        }).state('book', {
            url: '/book',
            abstract: true,
            template: '<ui-view/>'
        }).state('person', {
            url: '/person',
            abstract: true,
            template: '<ui-view/>'
        })
        //common
        .state('common.hello', {
            url: '/hello',
            templateUrl: 'html/common/hello.html'
        }).state('common.user-home', {
            /**
             * @param:ownerId 主人的AVOS ID
             * @param:hashId 滚动到的hashId userUsedBook userNeedBook userCircleBook
             */
            url: '/user-home/?ownerId&hashId',
            templateUrl: 'html/common/user-home.html'
        }).state('common.user-list', {
            /**
             * @param:cmd 当前模式 =near时显示你附近的用户
             * @param:title 当前View要显示的标题
             * @param:majorFilter 专业筛选限制
             */
            url: '/user-list?cmd&title&majorFilter',
            templateUrl: 'html/common/user-list.html'
        }).state('common.signup', {
            /**
             * @param:code 用于去微信获取用户消息的凭证
             */
            url: '/signup?code',
            templateUrl: 'html/common/sign-up.html'
        }).state('common.login', {
            url: '/login',
            templateUrl: 'html/common/login.html'
        })
        //book
        .state('book.recommend', {
            /**
             * @param:major 所有模块专门显示这个专业的书
             */
            url: '/recommend?major',
            templateUrl: 'html/book/recommend.html'
        }).state('book.book-list', {
            /**
             * @param:cmd 当前模式 =tag时显示一类书 =need
             * 当cmd=tag 时用的表示显示哪一类型的书
             * 当cmd=major 显示一个专业的相关书
             * 当cmd=latest 显示最新的书
             * @param:title 当前View要显示的标题
             * @param:tag 当cmd=tag 时用的表示显示哪一类型的书
             */
            url: '/book-list?cmd&title&tag',
            templateUrl: 'html/book/book-list.html'
        }).state('book.used-book-list', {
            /**
             * @param:cmd 当前模式 =near时显示你附近的二手书 =isbn时显示所有对应ISBN的二手书
             * @param:isbn13 当cmd=isbn时使用
             * @param:tagFilter 专业筛选
             */
            url: '/used-book-list?cmd&isbn13&tagFilter',
            templateUrl: 'html/book/used-book-list.html'
        }).state('book.one-book', {
            /**
             * @param:isbn13 一本书的isbn13号码
             */
            url: '/one-book/?isbn13',
            templateUrl: 'html/book/one-book.html'
        }).state('book.one-used-book', {
            /**
             * @param:usedBookAvosObjectId 二手书的AVOS ID
             */
            url: '/one-used-book/?usedBookAvosObjectId',
            templateUrl: 'html/book/one-used-book.html'
        })
        //person
        .state('person.send-msg-to-user', {
            /**
             * @param:receiverObjectId 接受者的微信openID
             * @param:usedBookObjectId 当前太难的二手书的AVOS ID
             * @param:role 消息发送者扮演的身份是 buy | sell
             * @param:inboxType 是否为发私信
             */
            url: '/send-msg-to-user?receiverObjectId&usedBookObjectId&role&inboxType',
            templateUrl: 'html/person/send-msg-to-user.html'
        }).state('person.upload-one-used-book', {
            /**
             * @param:isbn13 要上传的二手书的isbn13号码
             */
            url: '/upload-one-used-book/?isbn13&role',
            templateUrl: 'html/person/upload-one-used-book.html'
        }).state('person.edit-one-used-book', {
            /**
             * @param:usedBookId 要编辑的二手书的AVOS usedBookId
             */
            url: '/edit-one-used-book/?usedBookId',
            templateUrl: 'html/person/edit-one-used-book.html'
        }).state('person.status-list', {
            /**
             * @param:cmd 当前模式
             * =newUsedBook时显上传的二手书
             * =newNeedBook 显示发布的求书
             * =private 有同学给你发私信
             * =reviewUsedBook 有同学评价你的书
             */
            url: '/status-list?cmd',
            templateUrl: 'html/person/status-list.html'
        });
    $urlRouterProvider.otherwise('/book/recommend');
});
APP.run(function ($rootScope, $anchorScroll, User$, BookInfo$, BookRecommend$, DoubanBook$, InfoService$, SearchBook$, Status$, UsedBook$, SEO$, WechatNews$, BootstrapModalView$) {
    $rootScope.User$ = User$;
    $rootScope.BookInfo$ = BookInfo$;
    $rootScope.BookRecommend$ = BookRecommend$;
    $rootScope.DoubanBook$ = DoubanBook$;
    $rootScope.InfoService$ = InfoService$;
    $rootScope.SearchBook$ = SearchBook$;
    $rootScope.Status$ = Status$;
    $rootScope.UsedBook$ = UsedBook$;

    $rootScope.WechatNews$ = WechatNews$;
    $rootScope.BootstrapModalView$ = BootstrapModalView$;
    User$.loginWithUnionId(readCookie('unionId'));
    SEO$.setSEO();
    $rootScope.SEO$ = SEO$;
    /**
     * 滚动到一个hash标签
     * @param hashId
     */
    $rootScope.scrollToHash = function (hashId) {
        $anchorScroll(hashId);
    };
});
