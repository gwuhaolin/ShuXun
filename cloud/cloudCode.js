/**
 * Created by wuhaolin on 4/8/15.
 * AVOS 运代码
 */
"use strict";
var WechatAPI = require('cloud/wechat.js');

/**
 * 把上传到微信的二手书的图片下载到AVOS 的UsedBook 的 avosImageFile
 * 参数: serverId 图片上传到微信服务器后获得的图片的serverID
 * 参数: objectId 一个 AVOS的UsedBook的ObjectID
 * 返回: 如果下载图片成功返回AVOS的图片的url,否则返回error.
 * 如果 去微信下载图片失败 会把这组任务保存起来以后再去下载
 */
AV.Cloud.define('saveWechatImageToUsedBook', function (request, response) {
    var wechatServerId = request.params['serverId'];
    var usedBookAvosObjId = request.params['objectId'];
    if (!wechatServerId || !usedBookAvosObjId) {
        response.error('参数不合法');
        return;
    }
    WechatAPI.getAccessToken(function (accessToken) {
        var wechatUrl = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + accessToken + '&media_id=' + wechatServerId;
        var query = new AV.Query('UsedBook');
        query.get(usedBookAvosObjId).done(function (avosUsedBook) {
            var file = AV.File.withURL('UsedBook.png', wechatUrl, null, null);
            file.save().done(function (avosFile) {
                avosUsedBook.set('avosImageFile', avosFile);
                response.success();
                console.log('成功下载微信图片' + wechatServerId + '到' + usedBookAvosObjId);
            }).fail(function (error) {//去微信下载图片失败 TODO 待实现添加到稍后重试下载
                console.log(error);
            })
        }).fail(function (error) {//获得avosUsedBook失败
            response.error(error);
        });
    });
});
