/**
 * Created by wuhaolin on 6/1/15.
 */
var express = require('express');
var AV = require('leanengine');
var routerUtil = require('./routerUtil.js');
var bookInfo = require('../book/bookInfo.js');
var router = express.Router();
//可以通过req.AV.user获得当前用户的所有属性
router.use(AV.Cloud.CookieSession({secret: 'iShuXun', maxAge: 3600 * 24 * 30, fetchUser: true}));

/**
 * 图书推荐
 */
router.get('/recommend.html', function (req, res, next) {
    var re = routerUtil.genDataWithDefaultMeta();
    var user = req.AV.user;

    AV.Promise.when(
        bookInfo.getLatestBooks(0, 8),
        bookInfo.getNearUsedBook(0, 8, 'sell', user),
        bookInfo.getNearUsedBook(0, 8, 'need', user)
    ).then(function (bookInfos, usedBooks, needBooks) {
            re.latestBooks = routerUtil.avosArrayToJsonArray(bookInfos);
            re.usedBooks = routerUtil.avosArrayToJsonArray(usedBooks);
            re.needBooks = routerUtil.avosArrayToJsonArray(needBooks);
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

});


module.exports = router;