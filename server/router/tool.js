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

module.exports = router;