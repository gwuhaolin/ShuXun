/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('ion_person_uploadOneUsedBook', function ($scope, $controller, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $ionicModal) {
    $controller('person_uploadOneUsedBook', {$scope: $scope});

    $scope.scanQRBtnOnClick = function () {
        $scope.WeChatJS$.scanQRCode(function (code) {
            $scope.usedBookJson.isbn13 = code;
            $scope.loadDoubanBookInfo();
        });
    };

    $ionicModal.fromTemplateUrl('template/helpModalView.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.noBarCodeModalView = modal;
    });

});