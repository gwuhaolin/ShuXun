/**
 * Created by wuhaolin on 7/27/15.
 */
"use strict";

APP.service('BootstrapModalView$', function ($rootScope, $modal, InfoService$) {

    /**
     * 为$scope注册选择学校modalView功能
     * @param $scope
     * @param majorOnChooseCallback 当选中了一个专业时调用 返回选中的专业
     */
    this.openChooseMajorModalView = function ($scope, majorOnChooseCallback) {
        $scope.InfoService$ = InfoService$;
        var modalInstance = $modal.open({
            templateUrl: 'html/directive/choose-major-modal-view.html',
            scope: $scope
        });
        modalInstance.result.then(majorOnChooseCallback);
    };

});