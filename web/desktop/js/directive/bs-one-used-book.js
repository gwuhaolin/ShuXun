/**
 * Created by wuhaolin on 7/27/15.
 */
"use strict";

APP.directive('bsOneUsedBook', function (UsedBook$) {

    function link($scope) {
        $scope.UsedBook$ = UsedBook$;

        //获得旧书的图书信息
        var bookInfo = $scope.usedBook.get('info');
        if (bookInfo && !bookInfo.has('isbn13')) {
            bookInfo.fetch().always(function () {
                $scope.$digest();
            });
        }

        //如果要显示管理按钮就先判断这本旧书的主人是否是当前用户
        var me = AV.User.current();
        $scope.shouldShowManageBtn = $scope.shouldShowManageBtn && me && $scope.usedBook.get('owner').id == me.id;
    }

    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            usedBook: '=',
            //是否显示删除，修改按钮
            shouldShowManageBtn: '=',
            popoverPlacement: '@'
        },
        templateUrl: 'html/directive/one-used-book.html',
        link: link
    }
});

