/**
 * Created by wuhaolin on 5/31/15.
 */
APP.directive('usedBookOneLine', function () {

    function link($scope, $element) {
        $element.addClass('item text-center');
        $element.css('height', '144px');
        $element.css('padding', '0');

        if ($scope.usedBooks) {
            AV._.each($scope.usedBooks, function (usedBook) {
                var bookInfo = usedBook.get('info');
                if (bookInfo && bookInfo.id && !bookInfo.has('isbn13')) {
                    var query = new AV.Query(Model.BookInfo);
                    query.select('title', 'image', 'isbn13');
                    query.get(bookInfo.id).done(function (bookInfo) {
                        usedBook.set('info', bookInfo);
                    }).always(function () {
                        $scope.$digest();
                    });
                }
            });
        }
    }

    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            usedBooks: '='
        },
        templateUrl: 'temp/mould/usedBookOneLine.html',
        link: link
    }
});

