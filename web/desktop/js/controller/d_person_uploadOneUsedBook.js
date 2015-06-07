/**
 * Created by wuhaolin on 6/5/15.
 */
APP.controller('d_person_uploadOneUsedBook', function ($scope, $location, DoubanBook$) {
    $scope.step = 'info';
    $scope.usedBookInfo = {
        owner: AV.User.current(),
        isbn13: $location.search('isbn13'),
        price: null,
        des: '',
        image: '',
        title: ''
    };
    if ($scope.usedBookInfo.isbn13) {
        loadDoubanBookInfo();
    }

    //用$scope.usedBookInfo.isbn13去豆瓣加载图书信息
    function loadDoubanBookInfo() {
        DoubanBook$.getBookByISBD_simple($scope.usedBookInfo.isbn13, function (json) {
            if (json) {
                $scope.doubanBookInfo = json;
                $scope.usedBookInfo.isbn13 = json.isbn13;
                $scope.usedBookInfo.image = json.image.replace('mpic', 'lpic');//大图显示
                $scope.usedBookInfo.title = json.title;
                $scope.$apply();
            } else {
                alert('没有找到图书信息,再去搜搜看~');
            }
        });
    }
});
