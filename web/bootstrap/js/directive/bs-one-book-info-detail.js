/**
 * Created by wuhaolin on 7/28/15.
 */
"use strict";

APP.directive('bsOneBookInfoDetail', function () {
    return {
        restrict: 'E',
        scope: {
            //三本图书的信息,json格式
            bookInfo: '='
        },
        templateUrl: 'html/directive/one-book-info-detail.html'
    }
});
