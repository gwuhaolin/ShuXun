/**
 * Created by wuhaolin on 5/30/15.
 */
APP.controller('d_partials_NearUser', function ($scope, BookRecommend$) {
    $scope.users = BookRecommend$.NearUser.users;
});