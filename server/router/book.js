/**
 * Created by wuhaolin on 6/1/15.
 */
var express = require('express');
var AV = require('leanengine');
var RouterUtil = require('./routerUtil.js');
var BookInfo = require('../book/bookInfo.js');
var router = express.Router();
//可以通过req.AV.user获得当前用户的所有属性
router.use(AV.Cloud.CookieSession({secret: 'ishuxun', maxAge: 3600 * 24 * 30, fetchUser: true}));

/**
 * 图书推荐
 */
router.get('/recommend.html', function (req, res, next) {
    var re = RouterUtil.genDataWithDefaultMeta();
    var user = req.AV.user;

    AV.Promise.when(
        BookInfo.getLatestBooks(0, 8),
        BookInfo.getNearUsedBook(0, 8, 'sell', user),
        BookInfo.getNearUsedBook(0, 8, 'need', user)
    ).then(function (bookInfos, usedBooks, needBooks) {
            re.latestBooks = RouterUtil.avosArrayToJsonArray(bookInfos);
            re.usedBooks = RouterUtil.avosArrayToJsonArray(usedBooks);
            re.needBooks = RouterUtil.avosArrayToJsonArray(needBooks);
            res.render('book/recommend.html', re);
        }, function (err) {
            next(err);
        });

});

/**
 * 图书列表
 * @param:cmd 当前模式 =tag时显示一类书 =need
 * 当cmd=tag 时用的表示显示哪一类型的书
 * 当cmd=need 显示大家需要的书
 * 当cmd=major 显示一个专业的相关书
 * 当cmd=new 显示最新的书
 * @param:title 当前View要显示的标题
 * @param:tag 当cmd=tag 时用的表示显示哪一类型的书
 */
router.get('/bookList.html', function (req, res) {
    res.render('book/recommend.html');
});

/**
 * 一本图书的信息
 * @param:isbn13 图书的ISBN13
 */
router.get('/oneBook.html', function (req, res, next) {
    var isbn13 = req.query.isbn13;
    var re = RouterUtil.genDataWithDefaultMeta();
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
        bookInfo.genBigImage();
        if (bookInfo.attributes.rating) {
            bookInfo.attributes.rating.average = Math.floor(bookInfo.attributes.rating.average);
        }
        re.bookInfo = bookInfo;
        res.render('book/oneBook.html', re);
    }
});


module.exports = router;