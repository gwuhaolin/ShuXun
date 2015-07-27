/**
 * Created by wuhaolin on 7/26/15.
 */
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
    });
    $urlRouterProvider.otherwise('/book/recommend');
});
APP.run(function (User$) {
    User$.loginWithUnionId(readCookie('unionId'));
});