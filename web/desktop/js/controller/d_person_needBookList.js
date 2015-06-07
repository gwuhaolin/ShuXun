/**
 * Created by wuhaolin on 6/6/15.
 */
APP.controller('d_person_needBookList', function ($scope, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    UsedBook$.loadMyNeedBookList();
});
