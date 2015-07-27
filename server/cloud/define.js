/**
 * Created by wuhaolin on 4/8/15.
 * AVOS 运代码
 */
"use strict";
var AV = require('leanengine');
var WechatAPI = require('../wechat/wechatAPI.js');
var LBS = require('../util/lbs.js');
var Info = require('../util/info.js');
var DoubanBook = require('../book/douban-book.js');
var BookInfo = require('../book/book-info.js');
var DataRepair = require('../util/data-repair.js');

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
    DataRepair.updateBookInfoWhereTagsAndRatingIsNull();
    DataRepair.updateNoDoubanIdBookInfoFromDouban();
    res.success();
});

/**
 * 获得对应图书的信息
 * @param isbn13
 * @return 返回兼容豆瓣的json格式的图书信息
 */
AV.Cloud.define('getJsonBookByISBN13', function (req, res) {
    var isbn13 = req.params.isbn13;
    BookInfo.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
        if (avosBookInfo) {//已经有信息了
            res.success(avosBookInfo);
        } else {//还没有
            BookInfo.spiderBookInfo(isbn13).done(function (jsonBook) {
                res.success(jsonBook);
                BookInfo.saveBookInfo(jsonBook);
            }).fail(function (err) {
                res.error(err);
            })
        }
    });
});

/**
 * 根据我的IP地址更新我经纬度
 * 如果有latitude和longitude参数就用这两个参数更新,否则调用根据IP地址获得地理位置更新
 * @param:latitude 纬度
 * @param:longitude 经度
 * 如果更新成功就返回更新后的json格式的user,否则返回error
 */
AV.Cloud.define('updateMyLocation', function (req, res) {
    var latitude;
    var longitude;
    if (req.params['latitude'] && req.params['longitude']) {//用户提交的GPS地位
        latitude = parseFloat(req.params['latitude']);
        longitude = parseFloat(req.params['longitude']);
        updateLocation();
    } else {//使用IP地址定位
        var ip = req.remoteAddress;
        LBS.getLocationByIP(ip).done(function (location) {
            latitude = parseFloat(location.latitude);
            longitude = parseFloat(location.longitude);
            updateLocation();
        }).fail(function (err) {
            res.error(err);
        })
    }
    function updateLocation() {
        LBS.updateUserLocation(req.user, latitude, longitude).done(function (user) {
            res.success(user);
        }).fail(function (err) {
            res.error(err);
        })
    }
});

/**
 * 根据当前请求者的IP地址返回当前请求者的地理位置，返回的json格式为
 *      {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude)
        }
 */
AV.Cloud.define('getMyLocationByIP', function (req, res) {
    var ip = req.remoteAddress;
    LBS.getLocationByIP(ip).done(function (location) {
        var re = {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude)
        };
        res.success(re);
    }).fail(function (err) {
        res.error(err);
    })
});

////////////////////// Wechat /////////////////////////

/**
 * 获得微信JS-SDK配置
 * @param:url 当前微信浏览器的url
 */
AV.Cloud.define('getWechatJsConfig', function (req, res) {
    var url = req.params.url;
    WechatAPI.getJsConfig(url).done(function (config) {
        res.success(config);
    }).fail(function (err) {
        res.error(err);
    })
});

/**
 * 微信获取用户信息 OAuth step 2
 * @param:code 微信获取信息的凭证
 */
AV.Cloud.define('getWechatOAuthUserInfo', function (req, res) {
    var code = req.params.code;
    WechatAPI.getOAuthUserInfo_WeChat(code).done(function (userInfo) {
        res.success(userInfo);
    }).fail(function (err) {
        res.error(err);
    })
});

/**
 * 网页版获取用户信息 OAuth step 2
 * @param:code 微信获取信息的凭证
 */
AV.Cloud.define('getDesktopOAuthUserInfo', function (req, res) {
    var code = req.params.code;
    WechatAPI.getOAuthUserInfo_Desktop(code).done(function (userInfo) {
        res.success(userInfo);
    }).fail(function (err) {
        res.error(err);
    })
});

////////////////////// Info /////////////////////////

/**
 * 获得图书分类信息
 */
AV.Cloud.define('getAllBookTags', function (req, res) {
    res.success(Info.BookTags);
});

/**
 * 获得豆瓣书评列表
 * @param:id 豆瓣图书id
 * @param:start 开始的位置
 */
AV.Cloud.define('getDoubanBookReview', function (req, res) {
    var id = req.params.id;
    var start = req.params.start;
    DoubanBook.spiderDoubanBookReview(id, start).done(function (json) {
        res.success(json);
    }).fail(function (err) {
        res.error(err);
    })
});

/**
 * 获得图书电商购买信息
 * @param:isbn13 isbn13
 * @return:return 返回[{url,name,price,logoUrl}]
 */
AV.Cloud.define('getBusinessInfo', function (req, res) {
    var isbn13 = req.params.isbn13;
    DoubanBook.spiderBusinessInfo(isbn13).done(function (json) {
        res.success(json);
    }).fail(function (err) {
        res.error(err);
    });
});