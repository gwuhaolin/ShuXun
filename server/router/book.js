/**
 * Created by wuhaolin on 6/1/15.
 */
var _ = require('underscore');
var express = require('express');
var AV = require('leanengine');
var Model = require('../../web/js/model.js');
var RouterUtil = require('./router-util.js');
var BookInfo = require('../book/book-info.js');
var DoubanBook = require('../book/douban-book.js');
var router = express.Router();
//可以通过req.AV.user获得当前用户的所有属性
router.use(AV.Cloud.CookieSession({secret: 'ishuxun', maxAge: 3600 * 24 * 30, fetchUser: true}));

/**
 * 图书列表
 * @param:skip 跳过前skip条,默认=0
 * @param:cmd 当前模式
 * 当cmd=tag 时用的表示显示哪一类型的书
 * 当cmd=latest 显示最新的书
 * 当cmd=nearUsed 显示附近的要卖的旧书
 * 当cmd=nearNeed 显示附近的发布的求书
 * @param:tag 当cmd=tag 时用的表示显示哪一类型的书
 * @param:sortWay 按照什么方式排序 价格=price 距离=location major=专业
 */
router.get('/bookList.html', function (req, res, next) {
    var skip = req.query.skip || 0;
    var cmd = req.query.cmd;
    var limit = 20;//默认加载20条
    if (cmd == 'tag') {
        var tag = req.query.tag;
        DoubanBook.searchBooks(null, tag, skip, limit, null).done(function (doubanJson) {
            var bookInfos = [];
            _.each(doubanJson.books, function (oneJsonBook) {
                bookInfos.push(Model.BookInfo.new(oneJsonBook));
            });
            render(bookInfos, tag, doubanJson.total);
        }).fail(function (err) {
            next(err);
        });
    } else if (cmd == 'latest') {
        BookInfo.getLatestBooks(skip, limit).done(function (bookInfos) {
            render(bookInfos, '新书速递', 100);
        }).fail(function (err) {
            next(err);
        });
    } else if (cmd == 'nearUsed') {
        BookInfo.getNearUsedBook(skip, limit, 'sell', req.user).done(function (bookInfos) {
            render(bookInfos, '附近同学要卖的旧书', 100);
        }).fail(function (err) {
            next(err);
        });
    } else if (cmd == 'nearNeed') {
        BookInfo.getNearUsedBook(skip, limit, 'need', req.user).done(function (bookInfos) {
            render(bookInfos, '附近同学发布的求书', 100);
        }).fail(function (err) {
            next(err);
        });
    }

    function render(bookInfos, title, total) {
        var seoString = '';
        _.each(bookInfos, function (bookInfo) {
            seoString += bookInfo.attributes.title + bookInfo.attributes.author.toString();
        });
        var re = RouterUtil.genDataWithDefaultMeta(seoString);
        re.bookInfos = bookInfos;
        re.title = title;
        re.cmd = cmd;
        //用于分页显示
        re.page = {
            nowSkip: skip,
            preSkip: skip - limit,
            nextSkip: skip + limit,
            skipList: []
        };
        if (re.page.preSkip < 0) {
            re.page.preSkip = 0;
        }
        for (var i = 0; i < total; i += limit) {
            re.page.skipList.push(i);
        }
        res.render('book/bookList.html', re);
    }
});

/**
 * 一本图书的信息
 * @param:isbn13 图书的ISBN13
 */
router.get('/oneBook.html', function (req, res, next) {
    var isbn13 = req.query.isbn13;
    BookInfo.queryBookInfoByISBN(isbn13).done(function (bookInfo) {
        if (bookInfo) {
            render(bookInfo);
        } else {
            BookInfo.spiderBookInfo(isbn13).done(function (jsonBookInfo) {
                BookInfo.saveBookInfo(jsonBookInfo).done(function (bookInfo) {
                    render(bookInfo);
                }).fail(function (err) {
                    next(err);
                })
            }).fail(function (err) {
                next(err);
            });
        }
    }).fail(function (err) {
        next(err);
    });

    function render(bookInfo) {
        var seoString = bookInfo.attributes.title + bookInfo.attributes.author;
        var re = RouterUtil.genDataWithDefaultMeta(seoString);
        bookInfo.genBigImage();
        if (bookInfo.attributes.rating) {
            bookInfo.attributes.rating.average = Math.floor(bookInfo.attributes.rating.average);
        }
        re.bookInfo = bookInfo;
        res.render('book/oneBook.html', re);
    }
});

/**
 * 一本二手书的信息
 * @param:usedBookObjectId 二手书的AVOS id
 */
router.get('/oneUsedBook.html', function (req, res, next) {
    var usedBookId = req.query.usedBookObjectId;
    var query = new AV.Query(Model.UsedBook);
    query.include('info');
    query.get(usedBookId).done(function (usedBook) {
        render(usedBook);
    }).fail(function (err) {
        next(err);
    });

    function render(usedBook) {
        var seoString = usedBook.attributes.title + usedBook.attributes.author + usedBook.attributes.des;
        var re = RouterUtil.genDataWithDefaultMeta(seoString);
        re.usedBook = usedBook;
        usedBook.get('info').genBigImage();
        res.render('book/oneUsedBook.html', re);
    }
});

module.exports = router;