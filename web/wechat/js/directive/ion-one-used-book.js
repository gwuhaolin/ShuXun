/**
 * Created by wuhaolin on 5/31/15.
 */
"use strict";

APP.directive('ionOneUsedBook', function () {

    function link($scope) {
        $scope.$watch(function () {
            return $scope.usedBook;
        }, function () {
            //如果usedBook的bookInfo属性缺少就去获得旧书的图书信息
            if ($scope.usedBook) {
                var bookInfo = $scope.usedBook.get('bookInfo');
                if (bookInfo && bookInfo.id && !bookInfo.has('title')) {
                    var query = new AV.Query(Model.BookInfo);
                    query.select('title', 'image');
                    query.get(bookInfo.id).done(function (bookInfo) {
                        $scope.usedBook.set('bookInfo', bookInfo);
                    }).always(function () {
                        $scope.$digest();
                    });
                }
            }
        });

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
            shouldShowManageBtn: '='
        },
        templateUrl: 'html/directive/one-used-book.html',
        link: link
    }
});
