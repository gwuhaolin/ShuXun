/**
 * Created by wuhaolin on 5/30/15.
 */
APP.controller('d_partials_oneBookAsideInfo', function ($scope, BusinessSite$, UsedBook$, User$) {
    $scope.User$ = User$;
    var isbn13 = '9787302231240';

    //加载网购信息[{url,name,price,logoUrl}]
    BusinessSite$.getBusinessInfoByISBN(isbn13).done(function (jsonInfoList) {
        $scope.businessInfos = jsonInfoList;
        $scope.$apply();
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
        function clearTimer() {
            if (!UsedBook$.ISBN_sell.hasMore() && !UsedBook$.ISBN_need.hasMore()) {
                clearInterval(timer);
            }
        }

        for (var i = 0; i < UsedBook$.ISBN_sell.nowEqualISBNJsonUsedBookList.length; i++) {
            var one = UsedBook$.ISBN_sell.nowEqualISBNJsonUsedBookList[i];
            one.jsonOwner = avosUserToJson(one.owner);
        }
        for (i = 0; i < UsedBook$.ISBN_sell.nowEqualISBNJsonUsedBookList.length; i++) {
            one = UsedBook$.ISBN_sell.nowEqualISBNJsonUsedBookList[i];
            one.jsonOwner = avosUserToJson(one.owner);
        }
    }, 500);

});