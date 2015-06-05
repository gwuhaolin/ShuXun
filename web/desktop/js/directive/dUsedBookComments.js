/**
 * Created by wuhaolin on 6/4/15.
 */
APP.directive('dUsedBookComments', function (Status$) {
    function link($scope) {
        $scope.AV = AV;
        $scope.Status$ = Status$;
        //加载评论数据
        Status$.getStatusList_reviewBook($scope.usedBookObjectId).done(function (statusList) {
            $scope.statusList = statusList;
            $scope.$apply();
        });
        $scope.msg = {
            text: ''
        };
        $scope.submitReview = function () {
            Status$.reviewUsedBook($scope.ownerObjectId, $scope.usedBookObjectId, $scope.msg.text, 'buy').done(function (status) {
                $scope.statusList.push(status);
                $scope.msg.text = '';
                $scope.$apply();
            }).fail(function (err) {
                alert('发布评论失败:' + err.message);
            });
        }
    }

    return {
        restrict: 'E',
        scope: {
            usedBookObjectId: '=',
            ownerObjectId: '='
        },
        templateUrl: '../temp/usedBookCommentsTemplate.html',
        link: link
    }
});