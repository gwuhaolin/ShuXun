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
    });
    $urlRouterProvider.otherwise('/book/recommend');
});
APP.run(function (User$) {
    User$.loginWithUnionId(readCookie('unionId'));
});