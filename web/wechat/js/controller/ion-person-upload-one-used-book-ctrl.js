/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('ion_person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $ionicModal, BookInfo$, WeChatJS$, UsedBook$, InfoService$) {
    $scope.WeChatJS$ = WeChatJS$;
    $scope.InfoService$ = InfoService$;
    $scope.isLoading = false;

    //用$scope.usedBookJson.isbn13去豆瓣加载图书信息
    function loadDoubanBookInfo() {
        $scope.isLoading = true;
        BookInfo$.getBookInfoByISBN($scope.usedBookJson.isbn13).done(function (bookInfo) {
            $scope.bookInfo = bookInfo;
        }).fail(function () {
            alert('没有找到图书信息,再去搜搜看~');
            $state.go('tab.book_searchList');
        }).always(function () {
            $scope.isLoading = false;
            $scope.$digest();
        });
    }

    $scope.$on('$ionicView.afterEnter', function () {
        $scope.usedBookJson = {
            isbn13: $stateParams.isbn13,
            price: null,
            des: '',
            owner: AV.User.current()
        };
        $ionicScrollDelegate.scrollTop();
        if ($scope.usedBookJson.isbn13) {
            loadDoubanBookInfo();
        }
    });

    $scope.scanQRBtnOnClick = function () {
        WeChatJS$.scanQRCode(function (code) {
            $scope.usedBookJson.isbn13 = code;
            loadDoubanBookInfo();
        });
    };

    /**
     * @param role 是要卖掉二手书(sell)还是发布需求(need)
     */
    $scope.submitOnClick = function (role) {
        $scope.usedBookJson.role = role;
        $scope.isLoading = true;
        var avosUsedBook = Model.UsedBook.new($scope.usedBookJson);
        UsedBook$.saveUsedBook(avosUsedBook).done(function () {
            if (role == 'sell') {
                $state.go('tab.person_usedBooksList');
            } else if (role == 'need') {
                $state.go('tab.person_needBooksList');
            }
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
        });
    };

    $ionicModal.fromTemplateUrl('template/helpModalView.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.noBarCodeModalView = modal;
    });

});