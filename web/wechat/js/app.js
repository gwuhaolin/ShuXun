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
        $stateProvider.state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'html/tabs.html'
        })
            //tab-book
            .state('tab.book_recommend', {
                /**
                 * @param:major 所有模块专门显示这个专业的书
                 */
                url: '/book/recommend?major',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/recommend.html'
                    }
                }
            }).state('tab.book_searchList', {
                /**
                 * @param:keyword 要搜索的关键字
                 */
                url: '/book/searchList/?keyword',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/search-list.html'
                    }
                }
            }).state('tab.book_bookList', {
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
                    'tab-book': {
                        templateUrl: 'html/book/book-list.html'
                    }
                }
            }).state('tab.book_usedBookList', {
                /**
                 * @param:cmd 当前模式 =near时显示你附近的二手书 =isbn时显示所有对应ISBN的二手书
                 * @param:isbn13 当cmd=isbn时使用
                 * @param:majorFilter 专业筛选
                 */
                url: '/book/usedBookList?cmd&isbn13&majorFilter',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/used-book-list.html'
                    }
                }
            }).state('tab.book_oneBook', {
                /**
                 * @param:isbn13 一本书的isbn13号码
                 */
                url: '/book/oneBook/?isbn13',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/one-book.html'
                    }
                }
            }).state('tab.book_oneUsedBook', {
                /**
                 * @param:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/book/oneUsedBook/?usedBookAvosObjectId',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/one-used-book.html'
                    }
                }
            }).state('tab.book_oneNeedBook', {
                /**
                 * @param:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/book/oneNeedBook/?usedBookAvosObjectId',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/one-need-book.html'
                    }
                }
            }).state('tab.book_bookReview', {
                /**
                 * @param:doubanBookId 豆瓣图书id
                 * @param:图书的名称
                 */
                url: '/book/bookReview?doubanBookId&bookTitle',
                views: {
                    'tab-book': {
                        templateUrl: 'html/book/book-review.html'
                    }
                }
            })
            //tab-person
            .state('tab.person_editOneUsedBook', {
                /**
                 * @param:usedBookId 要编辑的二手书的AVOS usedBookId
                 */
                url: '/person/editOneUsedBook/?usedBookId',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/edit-one-used-book.html'
                    }
                }
            }).state('tab.person_uploadOneUsedBook', {
                /**
                 * @param:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/person/uploadOneUsedBook/?isbn13',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/upload-one-used-book.html'
                    }
                }
            }).state('tab.person_uploadOneNeedBook', {
                /**
                 * @param:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/person/uploadOneNeedBook/?isbn13',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/upload-one-need-book.html'
                    }
                }
            }).state('tab.person_usedBooksList', {
                url: '/person/usedBookList',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/used-book-list.html'
                    }
                }
            }).state('tab.person_needBooksList', {
                url: '/person/needBookList',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/need-book-list.html'
                    }
                }
            }).state('tab.person_statusList', {
                /**
                 * @param:cmd 当前模式
                 * =newUsedBook时显上传的二手书
                 * =newNeedBook 显示发布的求书
                 * =private 有同学给你发私信
                 * =reviewUsedBook 有同学评价你的书
                 */
                url: '/person/statusList?cmd',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/status-list.html'
                    }
                }
            }).state('tab.person_editPersonInfo', {
                url: '/person/editPersonInfo',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/edit-person-info.html'
                    }
                }
            }).state('tab.person_my', {
                url: '/person/my',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/my.html'
                    }
                }
            }).state('tab.person_sendMsgToUser', {
                /**
                 * @param:receiverObjectId 接受者的微信openID
                 * @param:usedBookObjectId 当前太难的二手书的AVOS ID
                 * @param:role 消息发送者扮演的身份是 buy | sell
                 * @param:inboxType 是否为发私信
                 */
                url: '/person/sendMsgToUser?receiverObjectId&usedBookObjectId&role&inboxType',
                views: {
                    'tab-person': {
                        templateUrl: 'html/person/send-msg-to-user.html'
                    }
                }
            })
            //公共
            .state('tab.hello', {
                url: '/hello',
                views: {
                    'tab-person': {
                        templateUrl: 'html/tool/hello.html'
                    }
                }
            }).state('tab.signUp', {
                /**
                 * @param:code 用于去微信获取用户消息的凭证
                 */
                url: '/signUp?code',
                views: {
                    'tab-person': {
                        templateUrl: 'html/tool/sign-up.html'
                    }
                }
            }).state('tab.userList', {
                /**
                 * @param:cmd 当前模式 =near时显示你附近的用户
                 * @param:title 当前View要显示的标题
                 * @param:majorFilter 专业筛选限制
                 */
                url: '/userList?cmd&title&majorFilter',
                views: {
                    'tab-book': {
                        templateUrl: 'html/tool/user-list.html'
                    }
                }
            }).state('tab.userHome', {
                /**
                 * @param:ownerId 主人的AVOS ID
                 */
                url: '/userHome/?ownerId',
                views: {
                    'tab-book': {
                        templateUrl: 'html/tool/user-home.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/book/recommend');
    });

APP.run(function ($rootScope, $state, User$, WeChatJS$) {
    WeChatJS$.config();//马上调用配置微信
    User$.loginWithUnionId(readCookie('unionId'));
    $rootScope.$on('$stateChangeStart', function (event, nextState) {
        var stateName = nextState['name'];
        if (stateName.indexOf('tab.person_') >= 0) {//需要登录
            if (!AV.User.current()) {
                event.preventDefault();//停止当前
                $state.go('tab.hello');//去验证身份
            }
        }
    });
});
