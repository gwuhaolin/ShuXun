/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";

APP.service('BookInfo$', function ($rootScope, DoubanBook$) {
    var that = this;

    /**
     * TODO 在获取图书信息前先验证isbn编码合法 以及纠错
     * 获得对应isbn图书的信息
     * 先调用豆瓣book API，如果去豆瓣获取失败再要服务器的蜘蛛去抓取
     * @param isbn 图书的isbn编码
     * @returns {*|AV.Promise} 返回AV.BookInfo instance
     */
    this.getBookInfoByISBN = function (isbn) {
        var rePromise = new AV.Promise();
        DoubanBook$.getBookByISBN(isbn).done(function (doubanJson) {
            rePromise.resolve(Model.BookInfo.fromDouban(doubanJson));
        }).fail(function (doubanErr) {
            AV.Cloud.run('getJsonBookByISBN13', {
                isbn13: isbn
            }).done(function (bookInfoJson) {
                rePromise.resolve(Model.BookInfo.new(bookInfoJson));
            }).fail(function (spiderErr) {
                rePromise.reject(spiderErr ? spiderErr : doubanErr);
            })
        });
        return rePromise;
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
            query.select(['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'summary', 'price']);
            query.descending('pubdate');
            query.skip(that.LatestBook.books.length);
            query.limit(LoadCount);
            query.find().done(function (bookInfos) {
                if (bookInfos.length > 0) {
                    that.LatestBook.books.pushUniqueArray(bookInfos);
                } else {
                    that.LatestBook.hasMoreFlag = false;
                }
                $rootScope.$digest();
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
     * 返回AVOS BookInfo 数组，每个bookInfo都有usedBooksCount代表当前bookInfo有几本旧书
     */
    this.searchBook = function (keyword) {
        var rePromise = new AV.Promise();
        var query1 = new AV.Query(Model.BookInfo);
        query1.contains('author', keyword);
        var query2 = new AV.Query(Model.BookInfo);
        query2.contains('title', keyword);
        var query3 = new AV.Query(Model.BookInfo);
        query3.equalTo('tags', keyword);
        var query = AV.Query.or(query1, query2, query3);
        query.select('title', 'publisher', 'pubdate', 'author', 'price', 'image', 'isbn13');
        query.find().done(function (bookInfos) {
            rePromise.resolve(bookInfos);
        }).fail(function (err) {
            rePromise.reject(err);
        });
        return rePromise;
    };

    /**
     * 获得对应的ISBN号码的图书在各大电商平台的价格信息
     * @param isbn13 图书的豆瓣ID
     * @return {AV.Promise} 返回[{url,name,price,logoUrl}]
     */
    this.getBusinessInfoByISBN = function (isbn13) {
        return AV.Cloud.run('getBusinessInfo', {
            isbn13: isbn13
        }, null);
    }
});