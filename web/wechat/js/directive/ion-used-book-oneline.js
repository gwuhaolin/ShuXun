/**
 * Created by wuhaolin on 5/31/15.
 */
"use strict";

APP.directive('ionUsedBookOneline', function () {

    function link($scope, $element) {
        $element.addClass('item text-center');
        $element.css('height', '144px');
        $element.css('padding', '0');
        if ($scope.usedBooks) {
            $scope.showUsedBooks = $scope.usedBooks.slice(0, LoadCount);
            AV._.each($scope.showUsedBooks, function (usedBook) {
                var query = new AV.Query(Model.BookInfo);
                query.select('title', 'image');
                query.get(usedBook.attributes.bookInfo.id).done(function (bookInfo) {
                    usedBook.set('bookInfo', bookInfo);
                    $scope.$digest();
                })
            });
        }
    }

    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            usedBooks: '='
        },
        templateUrl: 'html/directive/used-book-oneline.html',
        link: link
    }
});

