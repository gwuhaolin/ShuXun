/**
 * Created by wuhaolin on 5/30/15.
 * AngularJS配置
 */
"use strict";

var leanAnalytics = new _LeanAnalytics('Wechat');
var APP = angular.module('APP', ['ionic'], null)
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        //配置ionic样式
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
        //配置路由表
        $stateProvider
            .state('common', {
                url: '/common',
                abstract: true,
                template: '<ion-nav-view></ion-nav-view>'
            }).state('book', {
                url: '/book',
                abstract: true,
                templateUrl: 'tabs.html'
            }).state('person', {
                url: '/person',
                abstract: true,
                templateUrl: 'tabs.html'
            })
            //common
            .state('common.hello', {
                url: '/hello',
                templateUrl: 'html/common/hello.html'
            }).state('common.signup', {
                /**
                 * @param:code 用于去微信获取用户消息的凭证
                 */
                url: '/signup?code',
                templateUrl: 'html/common/sign-up.html'
            }).state('common.user-list', {
                /**
                 * @param:cmd 当前模式 =near时显示你附近的用户
                 * @param:title 当前View要显示的标题
                 * @param:majorFilter 专业筛选限制
                 */
                url: '/user-list?cmd&title&majorFilter',
                templateUrl: 'html/common/user-list.html'
            }).state('common.user-home', {
                /**
                 * @param:ownerId 主人的AVOS ID
                 */
                url: '/user-home/?ownerId',
                templateUrl: 'html/common/user-home.html'
            })
            //book
            .state('book.recommend', {
                /**
                 * @param:major 所有模块专门显示这个专业的书
                 */
                url: '/recommend?major',
                views: {
                    'book': {
                        templateUrl: 'html/book/recommend.html'
                    }
                }
            }).state('book.search-list', {
                /**
                 * @param:keyword 要搜索的关键字
                 */
                url: '/search-list/?keyword',
                views: {
                    'book': {
                        templateUrl: 'html/book/search-list.html'
                    }
                }
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
                views: {
                    'book': {
                        templateUrl: 'html/book/book-list.html'
                    }
                }
            }).state('book.used-book-list', {
                /**
                 * @param:cmd 当前模式 =near时显示你附近的二手书 =isbn时显示所有对应ISBN的二手书
                 * @param:isbn13 当cmd=isbn时使用
                 * @param:majorFilter 专业筛选
                 */
                url: '/used-book-list?cmd&isbn13&majorFilter',
                views: {
                    'book': {
                        templateUrl: 'html/book/used-book-list.html'
                    }
                }
            }).state('book.one-book', {
                /**
                 * @param:isbn13 一本书的isbn13号码
                 */
                url: '/one-book/?isbn13',
                views: {
                    'book': {
                        templateUrl: 'html/book/one-book.html'
                    }
                }
            }).state('book.one-used-book', {
                /**
                 * @param:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/one-used-book/?usedBookAvosObjectId',
                views: {
                    'book': {
                        templateUrl: 'html/book/one-used-book.html'
                    }
                }
            }).state('book.one-need-book', {
                /**
                 * @param:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/one-need-book/?usedBookAvosObjectId',
                views: {
                    'book': {
                        templateUrl: 'html/book/one-need-book.html'
                    }
                }
            }).state('book.book-review', {
                /**
                 * @param:doubanBookId 豆瓣图书id
                 * @param:图书的名称
                 */
                url: '/book-review?doubanBookId&bookTitle',
                views: {
                    'book': {
                        templateUrl: 'html/book/book-review.html'
                    }
                }
            })
            //person
            .state('person.edit-one-used-book', {
                /**
                 * @param:usedBookId 要编辑的二手书的AVOS usedBookId
                 */
                url: '/edit-one-used-book/?usedBookId',
                views: {
                    'person': {
                        templateUrl: 'html/person/edit-one-used-book.html'
                    }
                }
            }).state('person.upload-one-used-book', {
                /**
                 * @param:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/upload-one-used-book/?isbn13',
                views: {
                    'person': {
                        templateUrl: 'html/person/upload-one-used-book.html'
                    }
                }
            }).state('person.upload-one-need-book', {
                /**
                 * @param:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/upload-one-need-book/?isbn13',
                views: {
                    'person': {
                        templateUrl: 'html/person/upload-one-need-book.html'
                    }
                }
            }).state('person.used-books-list', {
                url: '/used-book-list',
                views: {
                    'person': {
                        templateUrl: 'html/person/used-book-list.html'
                    }
                }
            }).state('person.need-books-list', {
                url: '/need-book-list',
                views: {
                    'person': {
                        templateUrl: 'html/person/need-book-list.html'
                    }
                }
            }).state('person.status-list', {
                /**
                 * @param:cmd 当前模式
                 * =newUsedBook时显上传的二手书
                 * =newNeedBook 显示发布的求书
                 * =private 有同学给你发私信
                 * =reviewUsedBook 有同学评价你的书
                 */
                url: '/status-list?cmd',
                views: {
                    'person': {
                        templateUrl: 'html/person/status-list.html'
                    }
                }
            }).state('person.edit-person-info', {
                url: '/edit-person-info',
                views: {
                    'person': {
                        templateUrl: 'html/person/edit-person-info.html'
                    }
                }
            }).state('person.my', {
                url: '/person/my',
                views: {
                    'person': {
                        templateUrl: 'html/person/my.html'
                    }
                }
            }).state('person.send-msg-to-user', {
                /**
                 * @param:receiverObjectId 接受者的微信openID
                 * @param:usedBookObjectId 当前太难的二手书的AVOS ID
                 * @param:role 消息发送者扮演的身份是 buy | sell
                 * @param:inboxType 是否为发私信
                 */
                url: '/send-msg-to-user?receiverObjectId&usedBookObjectId&role&inboxType',
                views: {
                    'person': {
                        templateUrl: 'html/person/send-msg-to-user.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/book/recommend');
    });

APP.run(function ($rootScope, $state, User$, WeChatJS$) {
    WeChatJS$.config();//马上调用配置微信
    User$.loginWithUnionId(readCookie('unionId'));
    $rootScope.$on('$stateChangeStart', function (event, nextState) {
        var stateName = nextState['name'];
        if (stateName.indexOf('person.') >= 0) {//需要登录
            if (!AV.User.current()) {
                event.preventDefault();//停止当前
                $state.go('common.hello');//去验证身份
            }
        }
    });
});
