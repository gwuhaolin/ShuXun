/**
 * Created by wuhaolin on 6/4/15.
 * 一本二手书的旁边的相关信息
 */
APP.directive('dOneUsedBookAsideInfo', function () {
    function link($scope) {
        var query = new AV.Query(Model.UsedBook);
        query.include('owner');
        query.get($scope.usedBookObjectId).done(function (usedBook) {
            $scope.usedBook = usedBook;
            $scope.owner = usedBook.get('owner');
            $scope.$apply();
            //加载主人的其他的二手书
            var query = usedBook.get('owner').relation("usedBooks").query();
            query.find().done(function (usedBooks) {
                $scope.sellUsedBooks = [];
                $scope.needUsedBooks = [];
                for (var i = 0; i < usedBooks.length; i++) {
                    var one = usedBooks[i];
                    var role = one.get('role');
                    if (role == 'sell') {
                        $scope.sellUsedBooks.push(one);
                    } else if (role == 'need') {
                        $scope.needUsedBooks.push(one);
                    }
                }
                $scope.$apply();
            });
        });
    }

    return {
        restrict: 'E',
        scope: {
            usedBookObjectId: '='
        },
        templateUrl: '../temp/dOneUsedBookAsideInfoTemplate.html',
        link: link
    }
});
