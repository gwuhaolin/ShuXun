/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";

APP.service('BookInfo$', function ($rootScope) {
    var that = this;
    var AttrName = ['doubanId', 'isbn13', 'title', 'image', 'author', 'translator', 'publisher', 'pubdate', 'price', 'pages', 'summary', 'binding', 'catalog', 'author_intro'];

    this.avosBookInfoToJson = function (avosBookInfo) {
        var re = {};
        for (var i = 0; i < AttrName.length; i++) {
            var attrName = AttrName[i];
            re[attrName] = avosBookInfo.get(attrName);
        }
        re.objectId = avosBookInfo.id;
        re.updatedAt = avosBookInfo.get('updatedAt');
        return re;
    };

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
     */
    this.LatestBook = {
        jsonBooks: [],
        hasMoreFlag: true,
        loadMore: function () {
            var query = new AV.Query('BookInfo');
            query.select(['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price']);
            query.descending('pubdate');
            query.skip(that.LatestBook.jsonBooks.length + RandomStart);
            query.limit(LoadCount);
            query.find().done(function (avosBookInfoList) {
                if (avosBookInfoList.length > 0) {
                    for (var i = 0; i < avosBookInfoList.length; i++) {
                        that.LatestBook.jsonBooks.push(that.avosBookInfoToJson(avosBookInfoList[i]));
                    }
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