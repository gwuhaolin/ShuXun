/**
 * Created by wuhaolin on 5/20/15.
 *
 */
"use strict";

APP.controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, User$) {
    $scope.isLoading = false;
    $scope.WeChatJS$ = WeChatJS$;
    $scope.$on('$ionicView.afterEnter', function () {
        $scope.usedBookInfo = {
            isbn13: $stateParams.isbn13,
            price: null,
            des: '',
            image: '',
            title: ''
        };
        $ionicScrollDelegate.scrollTop();
        if ($scope.usedBookInfo.isbn13) {
            loadDoubanBookInfo();
        }
        $scope.usedBookInfo.owner = User$.getCurrentAvosUser();
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
                $scope.doubanBookInfo = json;
                $scope.usedBookInfo.isbn13 = json.isbn13;
                $scope.isLoading = false;
                $scope.usedBookInfo.image = json.image.replace('mpic', 'lpic');//大图显示
                $scope.usedBookInfo.title = json.title;
                $scope.$apply();
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
        var avosUsedBook = UsedBook$.jsonUsedBookToAvos($scope.usedBookInfo);
        avosUsedBook.save(null).done(function () {
            if (role == 'sell') {
                UsedBook$.loadMyAvosUsedBookList();
                $state.go('tab.person_usedBooksList');
            } else if (role == 'need') {
                UsedBook$.loadMyAvosNeedBookList();
                $state.go('tab.person_needBooksList');
            }
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
            $scope.$apply();
        })
    };

    //常用描述语
    $scope.commonWords = ['正版', '新书', '送笔记', '可议价', '不议价', '配光盘', '妹子白送'];

});