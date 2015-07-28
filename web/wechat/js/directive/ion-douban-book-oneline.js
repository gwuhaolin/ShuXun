/**
 * Created by wuhaolin on 5/31/15.
 * 三本书排成一行
 */
"use strict";

APP.directive('ionDoubanBookOneline', function () {
    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            books: '='
        },
        templateUrl: 'html/directive/douban-book-oneline.html'
    }
});