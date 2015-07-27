/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣图书列表
 */
"use strict";

APP.controller('ion_book_bookList', function ($scope, $injector, $stateParams, BookRecommend$) {
    $injector.invoke(book_bookList, this, {$scope: $scope});

    var cmd = $stateParams['cmd'];
    if (cmd == 'tag') {
        var tag = $stateParams['tag'];
        //统计用户行为
        $scope.$on('$ionicView.afterEnter', function () {
            var analyticsSugue = leanAnalytics.browseTag(tag);
            $scope.$on('$ionicView.afterLeave', function () {
                BookRecommend$.TagBook.books.length = 0;
                analyticsSugue.send();
            });
        });
    }
});