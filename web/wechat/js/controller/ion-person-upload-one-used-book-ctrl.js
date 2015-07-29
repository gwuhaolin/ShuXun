/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('ion_person_uploadOneUsedBook', function ($scope, $controller, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $ionicModal, WeChatJS$) {
    $controller('person_uploadOneUsedBook', {$scope: $scope});
    $scope.WeChatJS$ = WeChatJS$;

    $scope.scanQRBtnOnClick = function () {
        WeChatJS$.scanQRCode(function (code) {
            $scope.usedBookJson.isbn13 = code;
            $scope.loadDoubanBookInfo();
        });
    };

    /**
     * @param role 是要卖掉二手书(sell)还是发布需求(need)
     */
    $scope.submitOnClick = function (role) {
        $scope.saveUsedBook(role, function () {
            if (role == 'sell') {
                $state.go('tab.person_usedBooksList');
            } else if (role == 'need') {
                $state.go('tab.person_needBooksList');
            }
            $ionicHistory.clearHistory();
        });
    };

    $ionicModal.fromTemplateUrl('template/helpModalView.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.noBarCodeModalView = modal;
    });

});