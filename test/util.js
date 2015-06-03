/**
 * Created by wuhaolin on 5/29/15.
 */
var AV = require('leanengine');
var _ = require('underscore');
var assert = require('assert');
var bookUtil = require('../server/book/bookUtil.js');
var bookInfo = require('../server/book/bookInfo.js');

/**
 * 合法的ISBN13并且已经出版过的书
 * @type {Array}
 */
exports.ISBN_Legal_HasPub = ['9787511721051', '9787210036944', '9787535479914'];

/**
 * 不合法的ISBN13
 * @type {Array}
 */
exports.ISBN_Illegal_13 = ['9787511721052', '9787210036945', '9787300093599', '9787539971811', '9787539982695', '9787535479915'];
/**
 * 不合法的ISBN,不是13位的
 * @type {Array}
 */
exports.ISBN_Illegal_Not13 = ['97875121052', '9210036945', '973599', '978753942971811', '97875frf39982695', '9787$&8的535479915'];

/**
 * 检测活动的图书信息是否是OK的
 * 如果不和发会抛出异常
 * @param jsonBookInfo
 */
exports.checkJsonBookInfoIsNice = function (jsonBookInfo) {
    assert(_.keys(jsonBookInfo).length <= bookInfo.BookInfoAttrName.length, '不要有多余的属性,否则会在BookInfo里添加新字段');
    assert(bookUtil.isbn13IsLegal(jsonBookInfo.isbn13), 'isbn13必须合法');
    assert(jsonBookInfo.author.length > 0, '必须要有作者');
    assert(jsonBookInfo.price, '必须要有价格');
    assert(jsonBookInfo.publisher, '必须要有出版社');
    assert(jsonBookInfo.pubdate, '必须要有出版日期');
    assert(jsonBookInfo.title, '必须要有书名');
    assert(jsonBookInfo.image, '必须要有封面URL');
};

/**
 * 初始化AVOS
 */
exports.initAVOS = function () {
    var APP_ID = process.env['LC_APP_ID'] || 'kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0';
    var APP_KEY = process.env['LC_APP_KEY'] || 'nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm';
    var MASTER_KEY = process.env['LC_APP_MASTER_KEY'] || '6bc7zdxg90xi909pwtikora9uq2o2zvq402m2gfmb4w7tej2';
    AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
    AV.Cloud.useMasterKey();
};