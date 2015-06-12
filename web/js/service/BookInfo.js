/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";

APP.service('BookInfo$', function ($rootScope) {
    var that = this;

    /**
     * 获得对应isbn图书的信息
     * @param isbn13
     * @returns {*|AV.Promise} 返回兼容豆瓣的json格式
     */
    this.getJsonBookByISBN13 = function (isbn13) {
        return AV.Cloud.run('getJsonBookByISBN13', {
            isbn13: isbn13
        });
    };

    /**
     * 新书速递
     * 更具图书pubdate获得最新出版的图书
     */
    this.LatestBook = {
        books: [],
        hasMoreFlag: true,
        loadMore: function () {
            var query = new AV.Query(Model.BookInfo);
            query.select(['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price']);
            query.descending('pubdate');
            query.skip(that.LatestBook.books.length + RandomStart);
            query.limit(LoadCount);
            query.find().done(function (bookInfos) {
                if (bookInfos.length > 0) {
                    that.LatestBook.books.pushUniqueArray(bookInfos);
                } else {
                    that.LatestBook.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMore: function () {
            return that.LatestBook.hasMoreFlag;
        }
    };

    /**
     * 在BookInfo表里进行全文检索
     * @param keyword 关键字
     * @returns {*|AV.Promise}
     */
    this.searchBook = function (keyword) {
        var query = new AV.SearchQuery('BookInfo');
        query.queryString(keyword);
        return query.find(null);
    }
});