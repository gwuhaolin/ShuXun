/**
 * Created by wuhaolin on 5/31/15.
 */
APP.directive('ionUsedBookOneline', function () {

    function link($scope, $element) {
        $element.addClass('item text-center');
        $element.css('height', '144px');
        $element.css('padding', '0');
    }

    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            usedBooks: '='
        },
        templateUrl: 'html/directive/used-book-oneline.html',
        link: link
    }
});

