/**
 * Created by wuhaolin on 3/25/15.
 *
 */
"use strict";

var APP = angular.module('APP', ['ionic'], null)

    .config(function ($stateProvider, $urlRouterProvider) {
        ionic.Platform.setPlatform('ios');
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
                url: '/book/searchList',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/searchList.html'
                    }
                }
            }).state('tab.book_bookList', {
                url: '/book/bookList?cmd&title&tag',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/bookList.html'
                    }
                }
            }).state('tab.book_usedBookList', {
                url: '/book/usedBookList?cmd&isbn13',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/usedBookList.html'
                    }
                }
            }).state('tab.book_userList', {
                url: '/book/userList?cmd&title',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/userList.html'
                    }
                }
            }).state('tab.book_oneBook', {
                url: '/book/oneBook/{isbn13}',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/oneBook.html'
                    }
                }
            }).state('tab.book_usedBookListByOwner', {
                url: '/book/usedBookListByOwner/{ownerId}',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/usedBookListByOwner.html'
                    }
                }
            }).state('tab.book_oneUsedBook', {
                url: '/book/oneUsedBook/{usedBookAvosObjectId}',
                views: {
                    'tab-book': {
                        templateUrl: 'temp/book/oneUsedBook.html'
                    }
                }
            })
            //tab-person
            .state('tab.person_editOneUsedBook', {
                url: '/person/editOneUsedBook/{indexInMyAvosUsedBook_notSell}',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/editOneUsedBook.html'
                    }
                }
            }).state('tab.person_uploadOneUsedBook', {
                url: '/person/uploadOneUsedBook/{isbn13}',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/uploadOneUsedBook.html'
                    }
                }
            }).state('tab.person_usedBooksList', {
                url: '/person/usedBookList',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/usedBookList.html'
                    }
                }
            }).state('tab.person_editPersonInfo', {
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
                url: '/person/sendMsgToUser?openId&msg',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/person/sendMsgToUser.html'
                    }
                }
            })
            //公共
            .state('tab.hello', {
                url: '/hello?state',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/tool/hello.html'
                    }
                }
            }).state('tab.signUp', {
                url: '/signUp?code&state',
                views: {
                    'tab-person': {
                        templateUrl: 'temp/tool/signUp.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/book/recommend');
    });

APP.run(function ($rootScope, $state, User$) {
    $rootScope.$on('$stateChangeStart', function (event, nextState) {
        var stateName = nextState['name'];
        if (stateName.indexOf('tab.person_') >= 0) {//需要登录
            if (!User$.getCurrentAvosUser()) {
                event.preventDefault();//停止当前
                $state.go('tab.hello',{state:stateName});//去验证身份
            }
        }
    });
});
