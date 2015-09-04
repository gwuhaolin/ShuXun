/**
 * Created by wuhaolin on 8/1/15.
 * 会定时执行的云函数
 */
var AV = require('leanengine');
var DataRepair = require('../util/data-repair.js');
var WechatNews = require('../wechat/wechatNews.js');
var DoubanBook = require('../book/douban-book.js');


/**
 * 去豆瓣抓取最新的图书,保存到AVOS LatestBook表
 */
AV.Cloud.define('spiderAndSaveLatestBooks', function (req, res) {
    DoubanBook.spiderAndSaveLatestBooks();
    res.success();
});

/**
 * 数据修复
 */
AV.Cloud.define('repairData', function (req, res) {
    DataRepair.fillUsedBookInfoWhereInfoIsNull();
    DataRepair.updateBookInfoUsedBooksRelation();
    DataRepair.updateNoDoubanIdBookInfoFromDouban();
    res.success();
});

/**
 * 调用微信接口获取所有存储在微信后台的图文消息
 */
AV.Cloud.define('spiderWechatNews', function (req, res) {
    WechatNews.spiderWechatNews().done(function () {
        res.success();
    }).fail(function (err) {
        res.error(err);
    })
});
