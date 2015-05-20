/**
 * Created by wuhaolin on 5/20/15.
 * 最新图书
 */
"use strict";

APP.service('LatestBook$', function ($rootScope, BookRecommend$) {
    var AttrName = ['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price'];
    var that = this;

    this.avosLatestBookToJson = function (avosBook) {
        var re = {};
        for (var i = 0; i < AttrName.length; i++) {
            var attr = AttrName[i];
            re[attr] = avosBook.get(attr);
        }
        re.updatedAt = avosBook.updatedAt;
        re.objectId = avosBook.id;
        return re;
    };

    this.jsonBooks = [];
    this.hasMoreFlag = true;
    this.loadMore = function () {
        var query = new AV.Query('LatestBook');
        query.descending('pubdate');
        query.skip(that.jsonBooks.length + BookRecommend$.RandomStart);
        query.limit(BookRecommend$.LoadCount);
        query.find().done(function (avosLatestBookList) {
            if (avosLatestBookList.length > 0) {
                for (var i = 0; i < avosLatestBookList.length; i++) {
                    that.jsonBooks.push(that.avosLatestBookToJson(avosLatestBookList[i]));
                }
            } else {
                that.hasMoreFlag = false;
            }
            $rootScope.$apply();
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    this.hasMore = function () {
        return that.hasMoreFlag;
    }
});