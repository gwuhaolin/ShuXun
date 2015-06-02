/**
 * Created by wuhaolin on 6/1/15.
 */
var _ = require('underscore');
var lbs = require('../util/lbs.js');

/**
 * 生成一个自带默认meta属性的json
 */
exports.genDataWithDefaultMeta = function () {
    return {
        meta: {
            title: '书循网-最快捷的二手书交易平台',
            keywords: '书循,书循网,微信,ishuxun,ishuxun.cn,二手书,二手教材,大学教材,二手书交易,旧书,课本,图书,网上书店,网上图书商城,新书,微信买书,微信交易平台',
            description: 'ishuxun书循,一款包含所有书本的信息的大学生书本交易网,轻松买书,迅速比价,自由淘书。让图书交易更简洁。提供最全的新书、二手书各种书本信息'
        }
    };
};

/**
 * 把AVOS数组转换为json数组
 * @param avosArray [avos]
 * @returns {Array} [json]
 */
exports.avosArrayToJsonArray = function (avosArray) {
    var re = [];
    _.each(avosArray, function (avos) {
        re.push(avos.attributes);
    });
    return re;
};

/**
 * 更具用户的request中的IP地址获得用户的地理位置
 * @param expressRequest
 * @returns {AV.Promise} 返回AV.GeoPoint
 */
exports.genAvosGeoFromRequestByIP = function (expressRequest) {
    var ip = expressRequest.header('x-real-ip');
    var rePromise = new AV.Promise(null);
    lbs.getLocationByIP(ip).done(function (location) {
        var avosGeo = new AV.GeoPoint({latitude: location.latitude, longitude: location.longitude});
        rePromise.resolve(avosGeo);
    }).fail(function (err) {
        rePromise.reject(err);
    });
    return rePromise;
};