/**
 * Created by wuhaolin on 5/20/15.
 * 图书推荐
 */
"use strict";

APP.service('BookRecommend$', function ($rootScope, DoubanBook$, User$, UsedBook$) {
    var that = this;

    /**
     * 所有图书分类
     * @type {Array}
     */
    this.BookTag = {
        tag: null,
        load: function () {
            AV.Cloud.run('getAllBookTags', null, null).done(function (tag) {
                that.BookTag.tag = tag;
                $rootScope.$apply();
            });
        },
        getTagAttrNames: function () {
            if (that['BookTag']['tag']) {
                return Object.keys(that['BookTag']['tag']);
            }
            return [];
        }
    };
    this['BookTag'].load();

    /**
     * 分类浏览
     * @type {{books: Array, loadMore: Function}}
     */
    this.TagBook = {
        /**
         * 当前搜索的图书分类
         */
        nowTag: '',
        setTag: function (tag) {
            if (tag != that.TagBook.nowTag) {
                that.TagBook.books = [];
                that.TagBook.nowTag = tag;
            }
        },
        books: [],
        hasMoreFlag: true,
        loadMore: function () {
            DoubanBook$.getBooksByTag(that.TagBook.nowTag, that.TagBook.books.length, LoadCount, function (json) {
                var booksJSON = json['books'];
                if (booksJSON.length > 0) {
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.TagBook.books.push(booksJSON[i]);
                    }
                } else {
                    that.TagBook.hasMoreTag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMore: function () {
            return that.TagBook.hasMoreFlag;
        }
    };

    /**
     * 专业相关图书
     * @type {{books: Array, loadMore: Function}}
     */
    this.MajorBook = {
        major: User$.getCurrentJsonUser() ? User$.getCurrentJsonUser().major : '',
        books: [],
        hasMoreFlag: true,
        loadMore: function () {
            DoubanBook$.getBooksByTag(that.MajorBook.major, that.MajorBook.books.length + RandomStart, LoadCount, function (json) {
                that.MajorBook.totalNum = json['total'];
                var booksJSON = json['books'];
                if (booksJSON.length > 0) {
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.MajorBook.books.push(booksJSON[i]);
                    }
                } else {
                    that.MajorBook.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMore: function () {
            return that.MajorBook.hasMoreFlag;
        }
    };

    /**
     * 附近同学发布的求书
     * @type {{books: Array, loadMore: Function}}
     */
    this.NearNeedBook = {
        jsonBooks: [],
        hasMoreFlag: true,
        loadMore: function () {
            var avosGeo = User$.getCurrentUserLocation();
            var query = new AV.Query('UsedBook');
            query.notEqualTo('owner', AV.User.current());//不要显示自己的上传的
            query.equalTo('role', 'need');
            if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                query.near("location", avosGeo);
            }
            if (that.NearNeedBook._majorFilter) {
                var ownerQuery = new AV.Query('_User');
                ownerQuery.equalTo('major', that.NearNeedBook._majorFilter);
                query.matchesQuery('owner', ownerQuery);
            }
            query.skip(that.NearNeedBook.jsonBooks.length + RandomStart);
            query.limit(LoadCount);
            query.find().done(function (avosUsedBooks) {
                if (avosUsedBooks.length > 0) {
                    for (var i = 0; i < avosUsedBooks.length; i++) {
                        that.NearNeedBook.jsonBooks.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                    }
                } else {
                    that.NearNeedBook.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMore: function () {
            return that.NearNeedBook.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.NearNeedBook._majorFilter) {
                that.NearNeedBook.jsonBooks.length = 0;
                that.NearNeedBook.hasMoreFlag = true;
                that.NearNeedBook._majorFilter = major;
                that.NearNeedBook.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.NearNeedBook._majorFilter;
        }
    };

    /**
     * 附近的二手图书
     * @type {{books: Array, loadMore: Function, hasMore: Function}}
     */
    this.NearUsedBook = {
        jsonBooks: [],
        hasMoreFlag: true,
        loadMore: function () {
            var avosGeo = User$.getCurrentUserLocation();
            var query = new AV.Query('UsedBook');
            query.notEqualTo('owner', AV.User.current());//不要显示自己的上传的
            query.equalTo('role', 'sell');
            if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                query.near("location", avosGeo);
            }
            if (that.NearUsedBook._majorFilter) {
                var ownerQuery = new AV.Query('_User');
                ownerQuery.equalTo('major', that.NearUsedBook._majorFilter);
                query.matchesQuery('owner', ownerQuery);
            }
            query.skip(that.NearUsedBook.jsonBooks.length);
            query.limit(LoadCount);
            query.find().done(function (avosUsedBooks) {
                if (avosUsedBooks.length > 0) {
                    for (var i = 0; i < avosUsedBooks.length; i++) {
                        that.NearUsedBook.jsonBooks.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                    }
                } else {
                    that.NearUsedBook.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMore: function () {
            return that.NearUsedBook.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.NearUsedBook._majorFilter) {
                that.NearUsedBook.jsonBooks.length = 0;
                that.NearUsedBook.hasMoreFlag = true;
                that.NearUsedBook._majorFilter = major;
                that.NearUsedBook.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.NearUsedBook._majorFilter;
        }
    };

    /**
     * 我附近的用户
     * @type {{jsonUsers: Array, loadMore: Function, hasMore: Function}}
     */
    this.NearUser = {
        jsonUsers: [],
        hasMoreFlag: true,
        loadMore: function () {
            var avosGeo = User$.getCurrentUserLocation();
            var query = new AV.Query(AV.User);
            if (AV.User.current()) {
                query.notEqualTo('objectId', AV.User.current().id);//不要显示自己
            }
            if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                query.near("location", avosGeo);
            }
            that.NearUser._majorFilter && query.equalTo('major', that.NearUser._majorFilter);
            query.skip(that.NearUser.jsonUsers.length);
            query.limit(Math.floor(document.body.clientWidth / 50));//默认加载满屏幕
            query.find().done(function (avosUsers) {
                if (avosUsers.length > 0) {
                    for (var i = 0; i < avosUsers.length; i++) {
                        that.NearUser.jsonUsers.push(avosUserToJson(avosUsers[i]));
                    }
                } else {
                    that.NearUser.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMore: function () {
            return that.NearUser.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.NearUser._majorFilter) {
                that.NearUser.jsonUsers.length = 0;
                that.NearUser.hasMoreFlag = true;
                that.NearUser._majorFilter = major;
                that.NearUser.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.NearUser._majorFilter;
        }
    };
    this.NearUser.loadMore();
});