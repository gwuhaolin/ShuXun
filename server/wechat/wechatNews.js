/**
 * Created by wuhaolin on 8/1/15.
 * 同步微信图文到LeanCloud，用于桌面版显示
 */
var _ = require('underscore');
var Model = require('../../web/js/model.js');
var APIClient = require('./wechatAPI.js').APIClient;
var AV = require('leanengine');

/**
 * 调用微信接口获取所有存储在微信后台的图文消息
 */
exports.spiderWechatNews = function () {

    /**
     * 判断一个对应 thumbMediaID 的 WechatNews 条目是否已经被存储到了数据库里
     * @param thumbMediaID 图文消息的封面图片素材id
     * @returns {AV.Promise|t.Promise} boolean 是否已经被存储到了数据库里
     */
    function thisThumbMediaIDHasSaved(thumbMediaID) {
        var rePromise = new AV.Promise();
        var query = new AV.Query(Model.WechatNews);
        query.equalTo('thumbMediaID', thumbMediaID);
        query.count().done(function (count) {
            rePromise.resolve(count > 0);
        }).fail(function (err) {
            rePromise.reject(err);
        });
        return rePromise;
    }


    var rePromise = new AV.Promise();
    (new AV.Query(Model.WechatNews)).count().done(function (count) {
        APIClient.getMaterials('news', count, 20, function (err, result) {
            if (err) {
                rePromise.reject(err);
            } else {
                rePromise.resolve(result);
                _.each(result['item'], function (one) {
                    var newsItemList = one['content']['news_item'];
                    _.each(newsItemList, function (item) {
                        var thumbMediaID = item['thumb_media_id'];
                        thisThumbMediaIDHasSaved(thumbMediaID).done(function (isSaved) {
                            if (!isSaved) {
                                Model.WechatNews.new({
                                    thumbMediaID: item['thumb_media_id'],
                                    title: item['title'],
                                    url: item['url']
                                }).save().done(function (wechatNewsItem) {
                                    exports.downloadNewsThumbImage(wechatNewsItem.get('thumbMediaID')).done(function (imageFile) {
                                        wechatNewsItem.set('thumbImageFile', imageFile).save();
                                    });
                                });
                            }
                        })
                    });
                });
            }
        });
    });

    return rePromise;
};

/**
 * 用 thumbMediaID 调用微信接口去微信服务器下载图文消息的封面图片
 * @param thumbMediaID 图片id
 * @returns {AV.Promise|t.Promise} AV.File
 */
exports.downloadNewsThumbImage = function (thumbMediaID) {
    var rePromise = new AV.Promise();
    APIClient.getMaterial(thumbMediaID, function (err, result) {
        if (err) {
            rePromise.reject(err);
        } else {
            var imageFile = new AV.File(thumbMediaID + '.jpeg', result);
            imageFile.save().done(function (file) {
                rePromise.resolve(file);
            }).fail(function (err) {
                rePromise.reject(err);
            })
        }
    });
    return rePromise;
};