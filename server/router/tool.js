/**
 * Created by wuhaolin on 6/5/15.
 */
var _ = require('underscore');
var express = require('express');
var AV = require('leanengine');
var Model = require('../../web/js/Model.js');
var RouterUtil = require('./routerUtil.js');
var BookInfo = require('../book/bookInfo.js');
var DoubanBook = require('../book/doubanBook.js');
var router = express.Router();
//可以通过req.AV.user获得当前用户的所有属性
router.use(AV.Cloud.CookieSession({secret: 'ishuxun', maxAge: 3600 * 24 * 30, fetchUser: true}));

/**
 * 一个用户的主页
 * @param userObjectId 用户的AVOS id
 */
router.get('/userHome.html', function (req, res, next) {
    var userObjectId = req.query.userObjectId;
    var owner = new Model.User.new();
    owner.id = userObjectId;
    owner.fetch().done(function () {
        owner.relation('usedBooks').query().find(function (usedBookList) {
            render(owner, usedBookList);
        }).fail(function (err) {
            next(err);
        })
    }).fail(function (err) {
        next(err);
    });

    function render(owner, usedBookList) {
        var usedBooks = [];
        var needBooks = [];
        _.each(usedBookList, function (one) {
            var role = one.get('role');
            if (role == 'sell') {
                usedBooks.push(one);
            } else if (role == 'need') {
                needBooks.push(one);
            }
        });
        var re = RouterUtil.genDataWithDefaultMeta();
        re.owner = owner;
        re.usedBooks = usedBooks;
        re.needBooks = needBooks;
        res.render('tool/userHome.html', re);
    }
});

module.exports = router;