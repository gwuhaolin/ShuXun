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
            }).state('common.signUp', {
                /**
                 * @param:code 用于去微信获取用户消息的凭证
                 */
                url: '/signUp?code',
                templateUrl: 'html/common/sign-up.html'
            }).state('common.userList', {
                /**
                 * @param:cmd 当前模式 =near时显示你附近的用户
                 * @param:title 当前View要显示的标题
                 * @param:majorFilter 专业筛选限制
                 */
                url: '/userList?cmd&title&majorFilter',
                templateUrl: 'html/common/user-list.html'
            }).state('common.userHome', {
                /**
                 * @param:ownerId 主人的AVOS ID
                 */
                url: '/userHome/?ownerId',
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
            }).state('book.searchList', {
                /**
                 * @param:keyword 要搜索的关键字
                 */
                url: '/searchList/?keyword',
                views: {
                    'book': {
                        templateUrl: 'html/book/search-list.html'
                    }
                }
            }).state('book.bookList', {
                /**
                 * @param:cmd 当前模式 =tag时显示一类书 =need
                 * 当cmd=tag 时用的表示显示哪一类型的书
                 * 当cmd=major 显示一个专业的相关书
                 * 当cmd=latest 显示最新的书
                 * @param:title 当前View要显示的标题
                 * @param:tag 当cmd=tag 时用的表示显示哪一类型的书
                 */
                url: '/bookList?cmd&title&tag',
                views: {
                    'book': {
                        templateUrl: 'html/book/book-list.html'
                    }
                }
            }).state('book.usedBookList', {
                /**
                 * @param:cmd 当前模式 =near时显示你附近的二手书 =isbn时显示所有对应ISBN的二手书
                 * @param:isbn13 当cmd=isbn时使用
                 * @param:majorFilter 专业筛选
                 */
                url: '/usedBookList?cmd&isbn13&majorFilter',
                views: {
                    'book': {
                        templateUrl: 'html/book/used-book-list.html'
                    }
                }
            }).state('book.oneBook', {
                /**
                 * @param:isbn13 一本书的isbn13号码
                 */
                url: '/oneBook/?isbn13',
                views: {
                    'book': {
                        templateUrl: 'html/book/one-book.html'
                    }
                }
            }).state('book.oneUsedBook', {
                /**
                 * @param:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/oneUsedBook/?usedBookAvosObjectId',
                views: {
                    'book': {
                        templateUrl: 'html/book/one-used-book.html'
                    }
                }
            }).state('book.oneNeedBook', {
                /**
                 * @param:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/oneNeedBook/?usedBookAvosObjectId',
                views: {
                    'book': {
                        templateUrl: 'html/book/one-need-book.html'
                    }
                }
            }).state('book_bookReview', {
                /**
                 * @param:doubanBookId 豆瓣图书id
                 * @param:图书的名称
                 */
                url: '/bookReview?doubanBookId&bookTitle',
                views: {
                    'book': {
                        templateUrl: 'html/book/book-review.html'
                    }
                }
            })
            //person
            .state('person.editOneUsedBook', {
                /**
                 * @param:usedBookId 要编辑的二手书的AVOS usedBookId
                 */
                url: '/editOneUsedBook/?usedBookId',
                views: {
                    'person': {
                        templateUrl: 'html/person/edit-one-used-book.html'
                    }
                }
            }).state('person.uploadOneUsedBook', {
                /**
                 * @param:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/uploadOneUsedBook/?isbn13',
                views: {
                    'person': {
                        templateUrl: 'html/person/upload-one-used-book.html'
                    }
                }
            }).state('person.uploadOneNeedBook', {
                /**
                 * @param:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/uploadOneNeedBook/?isbn13',
                views: {
                    'person': {
                        templateUrl: 'html/person/upload-one-need-book.html'
                    }
                }
            }).state('person.usedBooksList', {
                url: '/usedBookList',
                views: {
                    'person': {
                        templateUrl: 'html/person/used-book-list.html'
                    }
                }
            }).state('person.needBooksList', {
                url: '/needBookList',
                views: {
                    'person': {
                        templateUrl: 'html/person/need-book-list.html'
                    }
                }
            }).state('person.statusList', {
                /**
                 * @param:cmd 当前模式
                 * =newUsedBook时显上传的二手书
                 * =newNeedBook 显示发布的求书
                 * =private 有同学给你发私信
                 * =reviewUsedBook 有同学评价你的书
                 */
                url: '/statusList?cmd',
                views: {
                    'person': {
                        templateUrl: 'html/person/status-list.html'
                    }
                }
            }).state('person.editPersonInfo', {
                url: '/editPersonInfo',
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
            }).state('person.sendMsgToUser', {
                /**
                 * @param:receiverObjectId 接受者的微信openID
                 * @param:usedBookObjectId 当前太难的二手书的AVOS ID
                 * @param:role 消息发送者扮演的身份是 buy | sell
                 * @param:inboxType 是否为发私信
                 */
                url: '/sendMsgToUser?receiverObjectId&usedBookObjectId&role&inboxType',
                views: {
                    'person': {
                        templateUrl: 'html/person/send-msg-to-user.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/book/recommend');
    });

APP.run(function ($rootScope, $state, User$, WeChatJS$, SEO$) {
    WeChatJS$.config();//马上调用配置微信
    SEO$.disableSEO();
    $rootScope.SEO$ = SEO$;
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
