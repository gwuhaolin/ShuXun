/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣图书接口
 */
"use strict";

APP.service('DoubanBook$', function ($rootScope) {
    var that = this;
    var baseUri = 'http://api.douban.com/v2/book';

    /**
     * 用书的ISBN号码获得书的信息
     * @param isbn 书的ISBN号码
     * @returns {AV.Promise} douban book json
     */
    this.getBookByISBN = function (isbn) {
        var url = baseUri + '/isbn/' + isbn + '?fields=id,rating,author,pubdate,image,binding,translator,catalog,pages,publisher,isbn13,title,author_intro,summary,price';
        return jsonp(url);
    };

    /**
     * 搜索图书
     * @param keyword 查询关键字 keyword和tag必传其一
     * @param start 取结果的offset 默认为0
     * @param count 取结果的条数 默认为20，最大为100
     * @return {AV.Promise} 返回豆瓣图书json
     */
    this.searchBooks = function (keyword, start, count) {
        var rePromise = new AV.Promise(null);
        var url = baseUri + '/search';
        if (keyword && keyword.length < 1) {
            rePromise.resolve([]);
        }
        url += '?q=' + keyword;
        if (start) {
            url += '&start=' + start;
        }
        if (count) {
            url += '&count=' + count;
        }
        url += '&fields=isbn13,title,image,author,publisher,pubdate,price';
        jsonp(url).done(function (json) {
            rePromise.resolve(json);
        }).fail(function (err) {
            rePromise.reject(err);
        });
        return rePromise;
    };

    /**
     * 获得分类对应的图书
     * @param tag 一个类别图书
     * @param start 取结果的offset 默认为0
     * @param count 取结果的条数 默认为20，最大为100
     * @returns {AV.Promise} [json]
     */
    this.getBooksByTag = function (tag, start, count) {
        var url = baseUri + '/search';
        if (!tag || tag.length < 1) {
            return AV.Promise.as([]);
        }
        url += '?tag=' + tag;
        if (start) {
            url += '&start=' + start;
        }
        if (count) {
            url += '&count=' + count;
        }
        url += '&fields=isbn13,title,image,author,publisher,pubdate,price';
        return jsonp(url);
    };

    /**
     * 豆瓣书评
     */
    this.BookReview = {
        reviewList: [],
        nowBookId: null,
        hasMoreFlag: true,
        loadMore: function () {
            AV.Cloud.run('getDoubanBookReview', {
                id: that.BookReview.nowBookId,
                start: that.BookReview.reviewList.length
            }, null).done(function (json) {
                if (json.length > 0) {
                    for (var i = 0; i < json.length; i++) {
                        that.BookReview.reviewList.push(json[i]);
                    }
                } else {
                    that.BookReview.hasMoreFlag = false;
                }
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMore: function () {
            return that.BookReview.hasMoreFlag;
        },
        /**
         * 清空当前数据
         */
        clear: function () {
            that.BookReview.reviewList = [];
            that.BookReview.hasMoreFlag = true;
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
        }
    };

    ///**
    // * 修正有问题的ISBN13错误的号码
    // * @param isbn13
    // * @return String 正确的10为的ISBN
    // */
    //function correctISBN13(isbn13) {
    //    var isbn9 = isbn13.substring(3, 12);
    //    var s = 0;
    //    for (var i = 0; i < 9; i++) {
    //        var num = parseInt(isbn9.charAt(i));
    //        s += num * (10 - i);
    //    }
    //    var m = s % 11;
    //    var n = 11 - m;
    //    var check = String(n);
    //    if (n == 10) {
    //        check = 'X';
    //    } else if (n == 11) {
    //        check = '0';
    //    }
    //    return String(isbn9 + check);
    //}
});