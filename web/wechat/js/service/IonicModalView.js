/**
 * Created by wuhaolin on 5/20/15.
 *
 */
"use strict";

APP.service('IonicModalView$', function ($rootScope, $ionicModal, $ionicHistory, InfoService$) {

    /**
     * 为$scope注册选择学校modalView功能
     * @param $scope
     * @param schoolOnChooseCallback 当选中了一个学校时调用 返回选中的学校
     */
    this.registerChooseSchoolModalView = function ($scope, schoolOnChooseCallback) {
        $scope.InfoService$ = InfoService$;
        $ionicModal.fromTemplateUrl('temp/tool/chooseSchoolModalView.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.chooseSchoolModalView = modal;
        });
        $scope.schoolOnChoose = function (school) {
            schoolOnChooseCallback(school);
            $scope.chooseSchoolModalView.hide();
        };
    };

    /**
     * 为$scope注册选择学校modalView功能
     * @param $scope
     * @param majorOnChooseCallback 当选中了一个专业时调用 返回选中的专业
     */
    this.registerChooseMajorModalView = function ($scope, majorOnChooseCallback) {
        $scope.InfoService$ = InfoService$;
        //选中了专业
        $ionicModal.fromTemplateUrl('temp/tool/chooseMajorModalView.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.chooseMajorModalView = modal;
        });
        $scope.majorOnChoose = function (major) {
            majorOnChooseCallback(major);
            $scope.chooseMajorModalView.hide();
        };
    };

    /**
     * 弹出详细文本信息
     * @param title 标题
     * @param pre 要放在pre里显示的内容
     */
    this.alertTitleAndPreModalView = function (title, pre) {
        var $scope = $rootScope.$new(true);
        $scope.titleAndPreModalViewData = {
            title: title,
            pre: pre
        };
        $ionicModal.fromTemplateUrl('temp/tool/titleAndPreModalView.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.titleAndPreModalView = modal;
            modal.show();
        });
    };

});