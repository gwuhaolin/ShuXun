/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('ion_person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, InfoService$) {
    $scope.WeChatJS$ = WeChatJS$;
    $scope.InfoService$ = InfoService$;

    $scope.isLoading = false;
    $scope.$on('$ionicView.afterEnter', function () {
        $scope.usedBookInfo = {
            isbn13: $stateParams.isbn13,
            price: null,
            des: '',
            owner: AV.User.current()
        };
        $ionicScrollDelegate.scrollTop();
        if ($scope.usedBookInfo.isbn13) {
            loadDoubanBookInfo();
        }
    });

    $ionicModal.fromTemplateUrl('template/helpModalView.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.noBarCodeModalView = modal;
    });

    //用$scope.usedBookInfo.isbn13去豆瓣加载图书信息
    function loadDoubanBookInfo() {
        $scope.isLoading = true;
        DoubanBook$.getBookByISBD_simple($scope.usedBookInfo.isbn13, function (json) {
            if (json) {
                $scope.isLoading = false;
                json.image = json.image.replace('mpic', 'lpic');//大图显示
                $scope.doubanBookInfo = json;
                $scope.$digest();
            } else {
                alert('没有找到图书信息,再去搜搜看~');
                $state.go('tab.book_searchList');
            }
        });
    }

    $scope.scanQRBtnOnClick = function () {
        WeChatJS$.scanQRCode(function (code) {
            $scope.usedBookInfo.isbn13 = code;
            loadDoubanBookInfo();
        });
    };

    /**
     * @param role 是要卖掉二手书(sell)还是发布需求(need)
     */
    $scope.submitOnClick = function (role) {
        $scope.usedBookInfo.role = role;
        $scope.isLoading = true;
        var avosUsedBook = Model.UsedBook.new($scope.usedBookInfo);
        avosUsedBook.save(null).done(function () {
            if (role == 'sell') {
                UsedBook$.loadMyUsedBookList();
                $state.go('tab.person_usedBooksList');
            } else if (role == 'need') {
                UsedBook$.loadMyNeedBookList();
                $state.go('tab.person_needBooksList');
            }
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
            $scope.$digest();
        })
    };

});