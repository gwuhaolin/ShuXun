/**
 * Created by wuhaolin on 7/24/15.
 */
APP.controller('topToolBarCtrl', function ($scope, $mdSidenav, BookRecommend$, SearchBook$) {
    $scope.$mdSidenav = $mdSidenav;
    $scope.BookRecommend$ = BookRecommend$;
    $scope.SearchBook$ = SearchBook$;

    BookRecommend$.BookTag.load();
});