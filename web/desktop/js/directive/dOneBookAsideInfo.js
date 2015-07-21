/**
 * Created by wuhaolin on 6/3/15.
 * 一本书的旁边的相关信息
 */

APP.directive('dOneBookAsideInfo', function (BusinessSite$, UsedBook$, User$, DoubanBook$) {

    function link($scope) {
        $scope.User$ = User$;
        $scope.BookReview = DoubanBook$.BookReview;
        var isbn13 = String($scope.isbn13);
        var doubanId = String($scope.doubanId);
        DoubanBook$.BookReview.nowBookId = doubanId;
        //加载网购信息[{url,name,price,logoUrl}]
        BusinessSite$.getBusinessInfoByISBN(isbn13).done(function (jsonInfoList) {
            $scope.businessInfos = jsonInfoList;
            $scope.$digest();
        });

        //////////// 二手书信息 /////////
        $scope.UsedBook$ = UsedBook$;

        var timer = setInterval(function () {
            if (UsedBook$.ISBN_sell.hasMore()) {
                UsedBook$.ISBN_sell.loadMoreUsedBookEqualISBN(isbn13);
            } else {
                clearTimer();
            }
            if (UsedBook$.ISBN_need.hasMore()) {
                UsedBook$.ISBN_need.loadMoreNeedBookEqualISBN(isbn13);
            } else {
                clearTimer();
            }
            if (doubanId && $scope.BookReview.hasMore()) {
                $scope.BookReview.loadMore();
            } else {
                clearTimer();
            }
            function clearTimer() {
                if (!UsedBook$.ISBN_sell.hasMore() && !UsedBook$.ISBN_need.hasMore()) {
                    clearInterval(timer);
                }
            }
        }, 500);

    }

    return {
        restrict: 'E',
        scope: {
            isbn13: '=',
            doubanId: '='
        },
        templateUrl: '../temp/dOneBookAsideInfoTemplate.html',
        link: link
    }
});
