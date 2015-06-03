/**
 * Created by wuhaolin on 5/20/15.
 * 图书推荐
 */
"use strict";

APP.service('BookRecommend$', function ($rootScope, DoubanBook$, BookInfo$) {
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
                BookInfo$.searchBook(tag).done(function (bookInfos) {
                    that.TagBook.books.unshiftArray(bookInfos);
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        },
        books: [],
        hasMoreFlag: true,
        loadMore: function () {
            DoubanBook$.getBooksByTag(that.TagBook.nowTag, that.TagBook.books.length, LoadCount, function (json) {
                var jsonBooks = json['books'];
                if (jsonBooks.length > 0) {
                    for (var i = 0; i < jsonBooks.length; i++) {
                        that.TagBook.books.push(Model.BookInfo.new(jsonBooks[i]));
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
        major: AV.User.current() ? AV.User.current().attributes.major : '',
        books: [],
        hasMoreFlag: true,
        loadMore: function () {
            DoubanBook$.getBooksByTag(that.MajorBook.major, that.MajorBook.books.length + RandomStart, LoadCount, function (json) {
                that.MajorBook.totalNum = json['total'];
                var booksJSON = json['books'];
                if (booksJSON.length > 0) {
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.MajorBook.books.push(Model.BookInfo.new(booksJSON[i]));
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
        },
        loadFromBookInfo: function () {
            BookInfo$.searchBook(that.MajorBook.major).done(function (bookInfos) {
                that.MajorBook.books.unshiftArray(bookInfos);
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    /**
     * 附近同学发布的求书
     * @type {{needBooks: Array, loadMore: Function}}
     */
    this.NearNeedBook = {
        needBooks: [],
        hasMoreFlag: true,
        loadMore: function () {
            var avosGeo = AV.User.current() ? AV.User.current().get('location') : null;
            var query = new AV.Query(Model.UsedBook);
            query.notEqualTo('owner', AV.User.current());//不要显示自己的上传的
            query.equalTo('role', 'need');
            if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                query.near("location", avosGeo);
            }
            if (that.NearNeedBook._majorFilter) {
                var ownerQuery = new AV.Query(Model.User);
                ownerQuery.equalTo('major', that.NearNeedBook._majorFilter);
                query.matchesQuery('owner', ownerQuery);
            }
            query.skip(that.NearNeedBook.needBooks.length + RandomStart);
            query.limit(LoadCount);
            query.find().done(function (needBooks) {
                if (needBooks.length > 0) {
                    that.NearNeedBook.needBooks.pushArray(needBooks);
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
                that.NearNeedBook.needBooks.length = 0;
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
     * @type {{usedBooks: Array, loadMore: Function, hasMore: Function}}
     */
    this.NearUsedBook = {
        usedBooks: [],
        hasMoreFlag: true,
        loadMore: function () {
            var avosGeo = AV.User.current() ? AV.User.current().get('location') : null;
            var query = new AV.Query(Model.UsedBook);
            query.notEqualTo('owner', AV.User.current());//不要显示自己的上传的
            query.equalTo('role', 'sell');
            avosGeo && query.near("location", avosGeo);
            if (that.NearUsedBook._majorFilter) {
                var ownerQuery = new AV.Query(Model.User);
                ownerQuery.equalTo('major', that.NearUsedBook._majorFilter);
                query.matchesQuery('owner', ownerQuery);
            }
            query.skip(that.NearUsedBook.usedBooks.length);
            query.limit(LoadCount);
            query.find().done(function (usedBooks) {
                if (usedBooks.length > 0) {
                    that.NearUsedBook.usedBooks.pushArray(usedBooks);
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
                that.NearUsedBook.usedBooks.length = 0;
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
     * @type {{users: Array, loadMore: Function, hasMore: Function}}
     */
    this.NearUser = {
        users: [],
        hasMoreFlag: true,
        loadMore: function () {
            var avosGeo = AV.User.current() ? AV.User.current().get('location') : null;
            var query = new AV.Query(Model.User);
            if (AV.User.current()) {
                query.notEqualTo('objectId', AV.User.current().id);//不要显示自己
            }
            if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                query.near("location", avosGeo);
            }
            that.NearUser._majorFilter && query.equalTo('major', that.NearUser._majorFilter);
            query.skip(that.NearUser.users.length);
            query.limit(Math.floor(document.body.clientWidth / 50));//默认加载满屏幕
            query.find().done(function (users) {
                if (users.length > 0) {
                    that.NearUser.users.pushArray(users);
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
                that.NearUser.users.length = 0;
                that.NearUser.hasMoreFlag = true;
                that.NearUser._majorFilter = major;
                that.NearUser.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.NearUser._majorFilter;
        }
    };
});