/**
 * Created by wuhaolin on 7/27/15.
 */
APP.controller('bs_book_recommendCtrl', function ($scope, $injector) {
    $injector.invoke(book_recommendCtrl, this, {$scope: $scope});

    this.setMajorFilterAndLoad();
});