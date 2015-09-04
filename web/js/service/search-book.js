/**
 * Created by wuhaolin on 5/20/15.
 * 图书搜索
 */
"use strict";

/**
 * 图书搜索,调用豆瓣接口
 */
APP.service('SearchBook$', function ($rootScope, $timeout, DoubanBook$) {
    var that = this;
    /**
     * 当前是否正在加载数据
     * @type {boolean}
     */
    this.isLoading = false;
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
        that.isLoading = true;
        if (that.keyword.length > 0) {
            DoubanBook$.searchBooks(that.keyword, that.books.length, 10).done(function (json) {
                that.totalNum = json['total'];
                if (that.totalNum > 0) {
                    var booksJSON = json['books'];
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.books.push(Model.BookInfo.fromDouban(booksJSON[i]));
                    }
                } else {
                    alert('没有找到你想要的图书');
                }
            }).always(function () {
                that.isLoading = false;
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
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
            leanAnalytics.searchBook(that.keyword).send();
        }, 1000);
    };

    /**
     * 去BookInfo表里全文搜索,把搜索到的结果加载到最前面
     */
    this.loadFromBookInfo = function () {
        that.isLoading = true;
        var query1 = new AV.Query(Model.BookInfo);
        query1.contains('author', that.keyword);
        var query2 = new AV.Query(Model.BookInfo);
        query2.contains('title', that.keyword);
        var query3 = new AV.Query(Model.BookInfo);
        query3.equalTo('tags', that.keyword);
        var query = AV.Query.or(query1, query2, query3);
        query.select('title', 'publisher', 'pubdate', 'author', 'price', 'image', 'isbn13');
        query.find().done(function (bookInfos) {
            that.books.unshiftUniqueArray(bookInfos);
            that.totalNum += bookInfos.length;
            that.isLoading = false;
            $rootScope.$digest();
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
});