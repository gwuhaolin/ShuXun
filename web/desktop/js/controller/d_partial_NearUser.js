/**
 * Created by wuhaolin on 5/30/15.
 */
APP.controller('d_partials_NearUser', function ($scope, BookRecommend$) {
    BookRecommend$.NearUser.loadMore();
    $scope.users = BookRecommend$.NearUser.users;
});