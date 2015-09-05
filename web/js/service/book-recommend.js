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
                $rootScope.$digest();
            });
        },
        getTagAttrNames: function () {
            if (that.BookTag.tag) {
                return Object.keys(that.BookTag.tag);
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
                that.TagBook.books.length = 0;
                that.TagBook.nowTag = tag;
                //来自BookInfo表里的tag相关的图书
                BookInfo$.searchBook(tag).done(function (bookInfos) {
                    that.TagBook.books.unshiftUniqueArray(bookInfos);
                    $rootScope.$digest();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        },
        books: [],
        hasMoreFlag: true,
        loadMore: function () {
            //来自 豆瓣图书 里的tag相关的图书
            DoubanBook$.getBooksByTag(that.TagBook.nowTag, that.TagBook.books.length, LoadCount).done(function (json) {
                var jsonBooks = json['books'];
                if (jsonBooks.length > 0) {
                    for (var i = 0; i < jsonBooks.length; i++) {
                        that.TagBook.books.push(Model.BookInfo.fromDouban(jsonBooks[i]));
                    }
                } else {
                    that.TagBook.hasMoreTag = false;
                }
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMore: function () {
            return that.TagBook.hasMoreFlag;
        }
    };

    /**
     * 最新更新的,不是我自己上传的,按照距离我距离排序的,
     * @param role UserBook role属性,是sell(要卖的) 还是 need(求书)
     * @param majorFilter 附加的专业显示,只显示和我同一个专业的同学上传的书,==null时无限制
     * @returns {AV.Query}
     * @private
     */
    function _buildUsedBookQuery(role, majorFilter) {
        var query = new AV.Query(Model.UsedBook);
        query.descending("updatedAt");
        query.include(['bookInfo']);
        role && query.equalTo('role', role);
        var me = AV.User.current();
        if (me || majorFilter) {
            var ownerQuery = new AV.Query(Model.User);
            if (me) {
                me && ownerQuery.notEqualTo('objectId', me.id);//不要显示自己的上传的
                var avosGeo = me ? me.get('location') : null;
                if (avosGeo) {
                    ownerQuery.near("location", avosGeo);
                }
            }
            if (majorFilter) {
                ownerQuery.equalTo('major', majorFilter);
            }
            query.matchesQuery('owner', ownerQuery);
        }
        return query;
    }

    /**
     * 附近同学发布的求书
     * @type {{needBooks: Array, loadMore: Function}}
     */
    this.NearNeedBook = {
        needBooks: [],
        hasMoreFlag: true,
        loadMore: function () {
            var query = _buildUsedBookQuery('need', that.NearNeedBook._majorFilter);
            query.skip(that.NearNeedBook.needBooks.length + RandomStart);
            query.limit(LoadCount);
            query.find().done(function (needBooks) {
                if (needBooks.length > 0) {
                    that.NearNeedBook.needBooks.pushUniqueArray(needBooks);
                } else {
                    that.NearNeedBook.hasMoreFlag = false;
                }
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMore: function () {
            return that.NearNeedBook.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.NearNeedBook._majorFilter) {
                RandomStart = 0;
                that.NearNeedBook.needBooks.length = 0;
                that.NearNeedBook.hasMoreFlag = true;
                that.NearNeedBook._majorFilter = major;
                that.NearNeedBook.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.NearNeedBook._majorFilter;
        },
        /**
         * 把主人同一个专业的同学上传的书插入到最开头
         */
        unshiftMajorBook: function () {
            var me = AV.User.current();
            var major = me ? me.get('major') : null;
            _buildUsedBookQuery('need', major).find().done(function (needBooks) {
                that.NearNeedBook.needBooks.unshiftUniqueArray(AV._.shuffle(needBooks));
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
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
            var query = _buildUsedBookQuery('sell', that.NearUsedBook._majorFilter);
            query.skip(that.NearUsedBook.usedBooks.length + RandomStart);
            query.limit(LoadCount);
            query.find().done(function (usedBooks) {
                if (usedBooks.length > 0) {
                    that.NearUsedBook.usedBooks.pushUniqueArray(usedBooks);
                } else {
                    that.NearUsedBook.hasMoreFlag = false;
                }
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMore: function () {
            return that.NearUsedBook.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.NearUsedBook._majorFilter) {
                RandomStart = 0;
                that.NearUsedBook.usedBooks.length = 0;
                that.NearUsedBook.hasMoreFlag = true;
                that.NearUsedBook._majorFilter = major;
                that.NearUsedBook.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.NearUsedBook._majorFilter;
        },
        /**
         * 把主人同一个专业的同学上传的书插入到最开头
         */
        unshiftMajorBook: function () {
            var me = AV.User.current();
            var major = me ? me.get('major') : null;
            _buildUsedBookQuery('sell', major).find().done(function (needBooks) {
                that.NearUsedBook.usedBooks.unshiftUniqueArray(AV._.shuffle(needBooks));
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    /**
     * 我附近的用户
     * @type {{users: Array, loadMore: Function, hasMore: Function}}
     */
    this.NearUser = {
        users: [],
        hasMoreFlag: true,
        /**
         * 最新更新的,不是我自己,按照距离我距离排序的,
         * @param majorFilter 附加的专业显示,只显示和我同一个专业的同学上传的书,==null时无限制
         * @private
         */
        _buildQuery: function (majorFilter) {
            var query = new AV.Query(Model.User);
            query.descending("updatedAt");
            var me = AV.User.current();
            me && query.notEqualTo('objectId', me.id);//不要显示自己
            var avosGeo = me ? me.get('location') : null;
            avosGeo && query.near("location", avosGeo);
            majorFilter && query.equalTo('major', majorFilter);
            return query;
        },
        loadMore: function () {
            var query = that.NearUser._buildQuery(that.NearUser._majorFilter);
            query.skip(that.NearUser.users.length);
            query.limit(Math.floor(document.body.clientWidth / 50));//默认加载满屏幕
            query.find().done(function (users) {
                if (users.length > 0) {
                    that.NearUser.users.pushUniqueArray(users);
                } else {
                    that.NearUser.hasMoreFlag = false;
                }
                $rootScope.$digest();
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
        },
        /**
         * 把主人同一个专业的同学插入到最开头
         */
        unshiftMajorUser: function () {
            var me = AV.User.current();
            var major = me ? me.get('major') : null;
            var query = that.NearUser._buildQuery(major);
            query.find().done(function (users) {
                that.NearUser.users.unshiftUniqueArray(AV._.shuffle(users));
            });
        }
    };
});