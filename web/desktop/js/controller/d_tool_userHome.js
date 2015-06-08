/**
 * Created by wuhaolin on 6/8/15.
 */
APP.controller('d_tool_userHome', function ($scope, UsedBook$) {
    var userObjectId = getQueryParameterByName('userObjectId');
    $scope.UsedBook$ = UsedBook$;
    var query = new AV.Query(Model.User);
    query.get(userObjectId).done(function (owner) {
        $scope.owner = owner;
        UsedBook$.loadUsedBookListForOwner(owner).done(function (usedBooks) {
            $scope.usedBooks = usedBooks;
            $scope.$apply();
        });
        UsedBook$.loadNeedBookListForOwner(owner).done(function (needBooks) {
            $scope.needBooks = needBooks;
            $scope.$apply();
        })
    });
});