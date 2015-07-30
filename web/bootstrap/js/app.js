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
    }).state('person_sendMsgToUser', {
        /**
         * @param:receiverObjectId 接受者的微信openID
         * @param:usedBookObjectId 当前太难的二手书的AVOS ID
         * @param:role 消息发送者扮演的身份是 buy | sell
         * @param:inboxType 是否为发私信
         */
        url: '/person/sendMsgToUser?receiverObjectId&usedBookObjectId&role&inboxType',
        views: {
            'main': {
                templateUrl: 'html/person/send-msg-to-user.html'
            }
        }
    }).state('person_uploadOneUsedBook', {
        /**
         * @param:isbn13 要上传的二手书的isbn13号码
         */
        url: '/person/uploadOneUsedBook/:isbn13',
        views: {
            'main': {
                templateUrl: 'html/person/upload-one-used-book.html'
            }
        }
    }).state('person_uploadOneNeedBook', {
        /**
         * @param:isbn13 要上传的二手书的isbn13号码
         */
        url: '/person/uploadOneNeedBook/:isbn13',
        views: {
            'main': {
                templateUrl: 'html/person/upload-one-need-book.html'
            }
        }
    }).state('person_editOneUsedBook', {
        /**
         * @param:usedBookId 要编辑的二手书的AVOS usedBookId
         */
        url: '/person/editOneUsedBook/:usedBookId',
        views: {
            'main': {
                templateUrl: 'html/person/edit-one-used-book.html'
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
APP.run(function ($rootScope, $location, $anchorScroll, User$) {
    User$.loginWithUnionId(readCookie('unionId'));
    /**
     * 滚动到一个hash标签
     * @param hashId
     */
    $rootScope.scrollToHash = function (hashId) {
        $location.hash(hashId);
        $anchorScroll();
    };
});
