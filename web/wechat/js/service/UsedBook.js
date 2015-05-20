/**
 * Created by wuhaolin on 5/20/15.
 * 二手书
 */
"use strict";

APP.service('UsedBook$', function ($rootScope) {
    var that = this;
    var UsedBookAttrNames = ['owner', 'isbn13', 'price', 'des', 'image', 'title', 'role'];

    /**
     * 是否正在加载数据
     * @type {boolean}
     */
    this.isLoading = false;

    /**
     * 加载对应用户所有还没有卖出的二手书
     * @param avosUser
     * @returns {*|AV.Promise}
     */
    this.loadUsedBookListForOwner = function (avosUser) {
        var query = avosUser.relation('usedBooks').query();
        query.equalTo('role', 'sell');
        return query.find();
    };

    /**
     * 加载对应用户所有发布的求书
     * @param avosUser
     * @returns {*|AV.Promise}
     */
    this.loadNeedBookListForOwner = function (avosUser) {
        var query = avosUser.relation('usedBooks').query();
        query.equalTo('role', 'need');
        return query.find();
    };

    /**
     * 所有我上传的还没有卖出的二手书
     * @type {Array}
     */
    this.myAvosUsedBookList = [];
    /**
     * 加载所有我上传的二手书
     */
    this.loadMyAvosUsedBookList = function () {
        that.isLoading = true;
        var query = AV.User.current().relation('usedBooks').query();
        query.equalTo('role', 'sell');
        query.descending('updatedAt');
        query.find().done(function (avosUsedBooks) {
            that.myAvosUsedBookList = avosUsedBooks;
        }).always(function () {
            that.isLoading = false;
            $rootScope.$apply();
        });
    };

    /**
     * 所有我发布的求书列表
     * @type {Array}
     */
    this.myAvosNeedBookList = [];
    /**
     * 加载所有我上传的二手书
     */
    this.loadMyAvosNeedBookList = function () {
        that.isLoading = true;
        var query = AV.User.current().relation('usedBooks').query();
        query.equalTo('role', 'need');
        query.descending('updatedAt');
        query.find().done(function (avosUsedBooks) {
            that.myAvosNeedBookList = avosUsedBooks;
        }).always(function () {
            that.isLoading = false;
            $rootScope.$apply();
        });
    };

    /**
     * 删除一本没有卖出的二手书
     * @param avosUsedBook
     */
    this.removeUsedBook = function (avosUsedBook) {
        var role = avosUsedBook.get('role');
        if (window.confirm('你确定要删除它吗?将不可恢复')) {
            avosUsedBook.destroy().done(function () {
                if (role == 'sell') {
                    that.loadMyAvosUsedBookList();
                } else if (role == 'need') {
                    that.loadMyAvosNeedBookList();
                }
            }).fail(function (error) {
                alert(error.message);
            })
        }
    };

    /**
     * 把AVOS的UsedBook转换为JSON格式的
     */
    this.avosUsedBookToJson = function (avosUsedBook) {
        if (avosUsedBook == null) {
            return null;
        }
        var json = {};
        for (var i = 0; i < UsedBookAttrNames.length; i++) {
            var attrName = UsedBookAttrNames[i];
            json[attrName] = avosUsedBook.get(attrName);
        }
        json.objectId = avosUsedBook.id;
        json.updatedAt = avosUsedBook.updatedAt;
        return json;
    };

    /**
     * 把JSON格式的UsedBook转换为AVOS格式的
     */
    this.jsonUsedBookToAvos = function (jsonUsedBook) {
        var UsedBook = AV.Object.extend("UsedBook");
        var usedBook = new UsedBook();
        for (var i = 0; i < UsedBookAttrNames.length; i++) {
            var attrName = UsedBookAttrNames[i];
            usedBook.set(attrName, jsonUsedBook[attrName]);
        }
        return usedBook;
    };

    /**
     * 用AVOS的 objectID 获得JSON格式的二手书信息
     */
    this.getJsonUsedBookByAvosObjectId = function (avosObjectId, callback) {
        var query = new AV.Query('UsedBook');
        query.get(avosObjectId).done(function (avosUsedBook) {
            callback(that.avosUsedBookToJson(avosUsedBook));
        })
    };

    this.ISBN_sell = {
        /**
         * 获得对应ISBN的二手书一共有多少本
         * @param isbn13
         * @returns {*|AV.Promise}
         */
        getUsedBookNumberEqualISBN: function (isbn13) {
            var query = new AV.Query('UsedBook');
            query.equalTo('role', 'sell');
            query.equalTo("isbn13", isbn13);
            return query.count();
        },
        /**
         * 目前正在加载的二手书的ISBN号码
         * @type {string}
         */
        nowISBN13: '',
        /**
         * 目前已经加载了对应的ISBN号码的二手书列表
         * @type {Array}
         */
        nowEqualISBNJsonUsedBookList: [],
        /**
         * 获得所有对应ISBN的二手书
         * @param isbn13
         */
        loadMoreUsedBookEqualISBN: function (isbn13) {
            that.isLoading = true;
            if (isbn13 != that.ISBN_sell.nowISBN13) {//如果是新的ISBN号码就清空以前的
                that.ISBN_sell.nowISBN13 = isbn13;
                that.ISBN_sell.nowEqualISBNJsonUsedBookList = [];
                that.ISBN_sell.hasMoreFlag = true;
            }
            var query = new AV.Query('UsedBook');
            query.equalTo("isbn13", that.ISBN_sell.nowISBN13);
            query.equalTo('role', 'sell');
            query.descending("updatedAt");
            query.skip(that.ISBN_sell.nowEqualISBNJsonUsedBookList.length);
            query.limit(5);
            query.include('owner');
            query.find().done(function (avosUsedBooks) {
                if (avosUsedBooks.length > 0) {
                    for (var i = 0; i < avosUsedBooks.length; i++) {
                        that.ISBN_sell.nowEqualISBNJsonUsedBookList.push(that.avosUsedBookToJson(avosUsedBooks[i]));
                    }
                } else {
                    that.ISBN_sell.hasMoreFlag = false;
                }
            }).always(function () {
                that.isLoading = false;
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMoreFlag: true,
        hasMore: function () {
            return that.ISBN_sell.hasMoreFlag;
        }
    };

    this.ISBN_need = {
        /**
         * 获得对应ISBN的二手书一共有多少本
         * @param isbn13
         * @returns {*|AV.Promise}
         */
        getNeedBookNumberEqualISBN: function (isbn13) {
            var query = new AV.Query('UsedBook');
            query.equalTo('role', 'need');
            query.equalTo("isbn13", isbn13);
            return query.count();
        },
        /**
         * 目前正在加载的二手书的ISBN号码
         * @type {string}
         */
        nowISBN13: '',
        /**
         * 目前已经加载了对应的ISBN号码的二手书列表
         * @type {Array}
         */
        nowEqualISBNJsonNeedBookList: [],
        /**
         * 获得所有对应ISBN的二手书
         * @param isbn13
         */
        loadMoreNeedBookEqualISBN: function (isbn13) {
            that.isLoading = true;
            if (isbn13 != that.ISBN_need.nowISBN13) {//如果是新的ISBN号码就清空以前的
                that.ISBN_need.nowISBN13 = isbn13;
                that.ISBN_need.nowEqualISBNJsonNeedBookList = [];
                that.ISBN_need.hasMoreFlag = true;
            }
            var query = new AV.Query('UsedBook');
            query.equalTo("isbn13", that.ISBN_need.nowISBN13);
            query.equalTo('role', 'need');
            query.descending("updatedAt");
            query.skip(that.ISBN_need.nowEqualISBNJsonNeedBookList.length);
            query.limit(5);
            query.include('owner');
            query.find().done(function (avosUsedBooks) {
                if (avosUsedBooks.length > 0) {
                    for (var i = 0; i < avosUsedBooks.length; i++) {
                        that.ISBN_need.nowEqualISBNJsonNeedBookList.push(that.avosUsedBookToJson(avosUsedBooks[i]));
                    }
                } else {
                    that.ISBN_need.hasMoreFlag = false;
                }
            }).always(function () {
                that.isLoading = false;
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMoreFlag: true,
        hasMore: function () {
            return that.ISBN_need.hasMoreFlag;
        }
    };
});