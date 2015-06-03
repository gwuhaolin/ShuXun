/**
 * Created by wuhaolin on 5/20/15.
 * 图书搜索
 */
"use strict";

/**
 * 图书搜索,调用豆瓣接口
 */
APP.service('SearchBook$', function ($rootScope, $timeout, DoubanBook$, BookInfo$) {
    var that = this;
    /**
     * 目前正在搜索的关键字
     * @type {string}
     */
    this.keyword = '';
    /**
     * 已经搜索获得到的书
     * @type {Array}
     */
    this.books = [];
    /**
     * 还可以加载更多吗?
     * @type {boolean}
     */
    this.hasMore = function () {
        return that.books.length < that.totalNum;
    };
    /**
     * 该关键字一共检索到的书的数量
     * @type {number}
     */
    this.totalNum = 0;
    /**
     * 加载更多到books
     */
    this.loadMore = function () {
        if (that.keyword.length > 0) {
            DoubanBook$.searchBooks(that.keyword, that.books.length, 10, function (json) {
                that.totalNum = json['total'];
                if (that.totalNum > 0) {
                    var booksJSON = json['books'];
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.books.push(Model.BookInfo.new(booksJSON[i]));
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    alert('没有找到你想要的图书');
                }
            })
        }
    };
    /**
     * 用于延迟自动提示
     * @type {null}
     */
    var timer = null;
    /**
     * 当搜索按钮被点击时
     */
    this.searchBtnOnClick = function () {
        that.loadMore();
        $timeout.cancel(timer);
    };
    /**
     * 当搜索框的关键字改变时
     */
    this.searchInputOnChange = function () {
        that.books = [];
        that.totalNum = 0;
        $timeout.cancel(timer);
        timer = $timeout(function () {
            that.loadFromBookInfo();
            that.searchBtnOnClick();
        }, 1000);
    };

    /**
     * 去BookInfo表里全文搜索,把搜索到的结果加载到最前面
     */
    this.loadFromBookInfo = function () {
        BookInfo$.searchBook(that.keyword).done(function (bookInfos) {
            that.books.unshiftArray(bookInfos);
            $rootScope.$apply();
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
        })
    }
});