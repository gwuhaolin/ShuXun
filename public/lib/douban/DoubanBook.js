/**
 * Created by wuhaolin on 3/24/15.
 *
 */
"use strict";

angular.module('DoubanBook', [], null)
    .service('DoubanBook$', function () {

        var baseUri = 'http://api.douban.com/v2/book';
        /**
         * 用书的ISBN号码获得书的信息
         * @param bookISBN 书的ISBN号码
         * @param callback
         */
        this.getBookByISBD = function (bookISBN, callback) {
            var url = baseUri + '/isbn/' + bookISBN;
            url += '?fields=rating,author,pubdate,image,binding,translator,catalog,pages,publisher,isbn13,title,author_intro,summary,price';
            jsonp(url, callback);
        };
        this.getBookByISBD_simple = function (bookISBN, callback) {
            var url = baseUri + '/isbn/' + bookISBN;
            url += '?fields=author,pubdate,image,publisher,title,price,isbn13';
            jsonp(url, callback);
        };
        /**
         * 搜索图书
         * @param keyword 查询关键字 keyword和tag必传其一
         * @param start 取结果的offset 默认为0
         * @param count 取结果的条数 默认为20，最大为100
         * @param callback [json]
         */
        this.searchBooks = function (keyword, start, count, callback) {
            var url = baseUri + '/search';
            if (keyword && keyword.length < 1) {
                return [];
            }
            url += '?q=' + keyword;
            if (start) {
                url += '&start=' + start;
            }
            if (count) {
                url += '&count=' + count;
            }
            url += '&fields=isbn13,title,image,author,publisher,pubdate,price';
            jsonp(url, function (json) {
                callback(json);
            });
        };
    });
