/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('ion_person_uploadOneUsedBook', function ($scope, $state, $stateParams, BookInfo$, UsedBook$, InfoService$) {
    $scope.InfoService$ = InfoService$;

    $scope.isLoading = false;
    $scope.usedBookInfo = {
        isbn13: $stateParams.isbn13,
        price: null,
        des: '',
        owner: AV.User.current()
    };
    if ($scope.usedBookInfo.isbn13) {
        loadDoubanBookInfo();
    }

    //用$scope.usedBookInfo.isbn13去豆瓣加载图书信息
    function loadDoubanBookInfo() {
        $scope.isLoading = true;
        BookInfo$.getBookInfoByISBN($scope.usedBookInfo.isbn13).done(function (bookInfo) {
            $scope.bookInfo = bookInfo;
        }).fail(function () {
            alert('没有找到图书信息,再去搜搜看~');
            $state.go('tab.book_searchList');
        }).always(function () {
            $scope.isLoading = false;
            $scope.$digest();
        });
        //DoubanBook$.getBookByISBD_simple($scope.usedBookInfo.isbn13, function (json) {
        //    if (json) {
        //        $scope.isLoading = false;
        //        json.image = json.image.replace('mpic', 'lpic');//大图显示
        //        $scope.doubanBookInfo = json;
        //        $scope.$digest();
        //    } else {
        //        alert('没有找到图书信息,再去搜搜看~');
        //        $state.go('tab.book_searchList');
        //    }
        //});
    }

    /**
     * @param role 是要卖掉二手书(sell)还是发布需求(need)
     */
    $scope.submitOnClick = function (role) {
        $scope.usedBookInfo.role = role;
        $scope.isLoading = true;
        var avosUsedBook = Model.UsedBook.new($scope.usedBookInfo);
        UsedBook$.saveUsedBook(avosUsedBook).done(function () {
            if (role == 'sell') {
                $state.go('person_usedBooksList');
            } else if (role == 'need') {
                $state.go('person_needBooksList');
            }
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
        });
    };

});