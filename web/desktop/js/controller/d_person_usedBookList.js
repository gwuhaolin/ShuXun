/**
 * Created by wuhaolin on 6/5/15.
 */
APP.controller('d_person_usedBookList', function ($scope, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    UsedBook$.loadMyUsedBookList();
});