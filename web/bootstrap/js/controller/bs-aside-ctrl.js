/**
 * Created by wuhaolin on 7/26/15.
 */

APP.controller('bs_asideCtrl', function ($scope,BookRecommend$) {
    $scope.BookRecommend$ = BookRecommend$;
    BookRecommend$.BookTag.load();

});