/**
 * Created by wuhaolin on 3/25/15.
 *
 */
"use strict";

var APP = angular.module('APP', ['ionic'], null)

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
        $stateProvider.state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'temp/tabs.html'
        })
            //tab-book
            .state('tab.book_recommend', {
                url: '/book/recommend',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/recommend.html'
                    }
                }
            }).state('tab.book_searchList', {
                /**
                 * 参数:keyword 要搜索的关键字
                 */
                url: '/book/searchList/:keyword',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/searchList.html'
                    }
                }
            }).state('tab.book_bookList', {
                /**
                 * 参数:cmd 当前模式 =tag时显示一类书 =need 显示用户需要的书
                 * 参数:title 当前View要显示的标题
                 * 参数:tag 当cmd=tag 时用的表示显示哪一类型的书
                 */
                url: '/book/bookList?cmd&title&tag',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/bookList.html'
                    }
                }
            }).state('tab.book_usedBookList', {
                /**
                 * 参数:cmd 当前模式 =near时显示你附近的二手书 =isbn时显示所有对应ISBN的二手书
                 * 参数:isbn13 当cmd=isbn时使用
                 */
                url: '/book/usedBookList?cmd&isbn13',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/usedBookList.html'
                    }
                }
            }).state('tab.book_oneBook', {
                /**
                 * 参数:isbn13 一本书的isbn13号码
                 */
                url: '/book/oneBook/:isbn13',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/oneBook.html'
                    }
                }
            }).state('tab.book_oneUsedBook', {
                /**
                 * 参数:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/book/oneUsedBook/:usedBookAvosObjectId',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/oneUsedBook.html'
                    }
                }
            }).state('tab.book_oneNeedBook', {
                /**
                 * 参数:usedBookAvosObjectId 二手书的AVOS ID
                 */
                url: '/book/oneNeedBook/:usedBookAvosObjectId',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/oneNeedBook.html'
                    }
                }
            })
            .state('tab.book_bookReview', {
                /**
                 * 参数:doubanBookId 豆瓣图书id
                 * 参数:图书的名称
                 */
                url: '/book/oneUsedBook?doubanBookId&bookTitle',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/bookReview.html'
                    }
                }
            })
            //tab-person
            .state('tab.person_editOneUsedBook', {
                /**
                 * 参数:usedBookId 要编辑的二手书的AVOS usedBookId
                 */
                url: '/person/editOneUsedBook/:usedBookId',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/editOneUsedBook.html'
                    }
                }
            }).state('tab.person_uploadOneUsedBook', {
                /**
                 * 参数:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/person/uploadOneUsedBook/:isbn13',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/uploadOneUsedBook.html'
                    }
                }
            }).state('tab.person_uploadOneNeedBook', {
                /**
                 * 参数:isbn13 要上传的二手书的isbn13号码
                 */
                url: '/person/uploadOneNeedBook/:isbn13',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/uploadOneNeedBook.html'
                    }
                }
            })
            .state('tab.person_usedBooksList', {
                url: '/person/usedBookList',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/usedBookList.html'
                    }
                }
            }).state('tab.person_needBooksList', {
                url: '/person/needBookList',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/needBookList.html'
                    }
                }
            })
            .state('tab.person_editPersonInfo', {
                url: '/person/editPersonInfo',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/editPersonInfo.html'
                    }
                }
            }).state('tab.person_my', {
                url: '/person/my',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/my.html'
                    }
                }
            }).state('tab.person_sendMsgToUser', {
                /**
                 * 参数:receiverObjectId 接受者的微信openID
                 * 参数:usedBookObjectId 当前太难的二手书的AVOS ID
                 * 参数:role 消息发送者扮演的身份是 buy | sell
                 * 参数:inboxType 是否为发私信
                 */
                url: '/person/sendMsgToUser?receiverObjectId&usedBookObjectId&role&inboxType',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/sendMsgToUser.html'
                    }
                }
            })
            //公共
            .state('tab.hello', {
                /**
                 * 参数:nextState 验证完身份后要去的状态
                 */
                url: '/hello?nextState',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/tool/hello.html'
                    }
                }
            }).state('tab.signUp', {
                /**
                 * 参数:code 用于去微信获取用户消息的凭证
                 * 参数:state 验证完身份后要去的状态
                 */
                url: '/signUp?code&state',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/tool/signUp.html'
                    }
                }
            }).state('tab.userList', {
                /**
                 * 参数:cmd 当前模式 =near时显示你附近的用户
                 * 参数:title 当前View要显示的标题
                 */
                url: '/userList?cmd&title',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/tool/userList.html'
                    }
                }
            }).state('tab.userHome', {
                /**
                 * 参数:ownerId 主人的AVOS ID
                 */
                url: '/userHome/:ownerId',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/tool/userHome.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/book/recommend');
    });

APP.run(function ($rootScope, $state, User$, Status$, WeChatJS$) {
    WeChatJS$.config();//马上调用配置微信
    User$.loginWithUnionId(readCookie('unionId'));
    $rootScope.$on('$stateChangeStart', function (event, nextState) {
        var stateName = nextState['name'];
        if (stateName.indexOf('tab.person_') >= 0) {//需要登录
            if (!User$.getCurrentAvosUser()) {
                event.preventDefault();//停止当前
                $state.go('tab.hello', {nextState: stateName});//去验证身份 TODO bug 有些state依赖必须的参数
            }
        }
    });
});
