/**
 * Created by wuhaolin on 6/2/15.
 * 图书搜索
 */
APP.controller('d_book_searchList', function ($scope, SearchBook$) {
    $scope.SearchBook$ = SearchBook$;
    var keyword = getQueryParameterByName('keyword');
    if (keyword) {
        SearchBook$.keyword = keyword;
        SearchBook$.searchBtnOnClick();
    }
});
