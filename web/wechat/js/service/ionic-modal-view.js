/**
 * Created by wuhaolin on 5/20/15.
 * Ionic自带View工具
 */
"use strict";

APP.service('IonicModalView$', function ($rootScope, $ionicModal, $ionicHistory, InfoService$, BookRecommend$) {

    /**
     * 为$scope注册选择学校modalView功能
     * @param $scope
     * @param schoolOnChooseCallback 当选中了一个学校时调用 返回选中的学校
     */
    this.registerChooseSchoolModalView = function ($scope, schoolOnChooseCallback) {
        $scope.InfoService$ = InfoService$;
        $ionicModal.fromTemplateUrl('html/directive/choose-school-modal-view.html', {
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
        $ionicModal.fromTemplateUrl('html/directive/choose-major-modal-view.html', {
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
     * 为$scope注册选择 Book Tag modalView功能
     * @param $scope
     * @param bookTagOnChooseCallback 当选中了一个 Book Tag 时调用 返回选中的 Book Tag
     */
    this.registerChooseBookTagModalView = function ($scope, bookTagOnChooseCallback) {
        $scope.BookRecommend$ = BookRecommend$;
        $ionicModal.fromTemplateUrl('html/directive/choose-book-tag-modal-view.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.chooseBookTagModalView = modal;
        });
        $scope.bookTagOnChoose = function (major) {
            bookTagOnChooseCallback(major);
            $scope.chooseBookTagModalView.hide();
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
        $ionicModal.fromTemplateUrl('html/directive/title-and-pre-modal-view.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.titleAndPreModalView = modal;
            modal.show();
        });
    };

});