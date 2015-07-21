/**
 * Created by wuhaolin on 5/31/15.
 */
APP.directive('oneNeedBook', function (UsedBook$) {

    function link($scope) {
        $scope.UsedBook$ = UsedBook$;

        //获得旧书的图书信息
        var bookInfo = $scope.needBook.get('info');
        if (bookInfo && bookInfo.id && !bookInfo.has('isbn13')) {
            var query = new AV.Query(Model.BookInfo);
            query.select('title', 'image');
            query.get(bookInfo.id).done(function (bookInfo) {
                $scope.needBook.set('info', bookInfo);
            }).always(function () {
                $scope.$apply();
            });
        }

        //如果要显示管理按钮就先判断这本旧书的主人是否是当前用户
        var me = AV.User.current();
        $scope.shouldShowManageBtn = $scope.shouldShowManageBtn && me && $scope.needBook.get('owner').id == me.id;
    }

    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            needBook: '=',
            //是否显示删除，修改按钮
            shouldShowManageBtn: '='
        },
        templateUrl: 'temp/tool/oneNeedBookTemplate.html',
        link: link
    }
});