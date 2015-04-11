/**
 * Created by wuhaolin on 4/8/15.
 * AVOS 运代码
 */
"use strict";
var WechatAPI = require('cloud/wechat.js');

/**
 * 把上传到微信的二手书的图片下载到AVOS 的UsedBook 的 avosImageFile
 * @param serverId  图片上传到微信服务器后获得的图片的serverID
 * @param bookId 一个 AVOS的UsedBook的ObjectID
 * 如果 去微信下载图片失败 会一小时后重新去下载
 */
function saveWechatImageToUsedBook(serverId, bookId) {
    var query = new AV.Query('UsedBook');
    query.get(bookId).done(function (avosUsedBook) {
        WechatAPI.APIClient.getMedia(serverId, function (error, buffer) {
            if (error || buffer.length < 100) {//去微信下载图片失败
                setTimeout(function () {
                    saveWechatImageToUsedBook(serverId, bookId);
                }, 1000 * 60 * 60);//一小时后重新去下载
            } else {
                var file = new AV.File('UsedBook', buffer, 'png');
                file.save().done(function (avosFile) {
                    avosUsedBook.save({
                        'avosImageFile': avosFile
                    })
                })
            }
        });
    })
}

/**
 * 把上传到微信的二手书的图片下载到AVOS 的UsedBook 的 avosImageFile
 * 参数: serverId 图片上传到微信服务器后获得的图片的serverID
 * 参数: objectId 一个 AVOS的UsedBook的ObjectID
 */
AV.Cloud.define('saveWechatImageToUsedBook', function (request, response) {
    var wechatServerId = request.params['serverId'];
    var usedBookAvosObjId = request.params['objectId'];
    if (wechatServerId == null || usedBookAvosObjId == null) {
        response.error('参数不合法');
    } else {
        saveWechatImageToUsedBook(wechatServerId, usedBookAvosObjId);
        response.success();
    }
});

/**
 * 当一本二手书被卖出时
 * 参数: id 被卖出的二手书的AVOS ID
 * 返回: 事物完成成功返回success,否则返回error
 */
AV.Cloud.define('usedBookHasSell', function (request, response) {
    var usedBookId = request.params['id'];
    var query = new AV.Query('UsedBook');
    query.get(usedBookId).done(function (avosUsedBook) {//从UsedBook表获得被卖的二手书
        var HasSellUsedBook = AV.Object.extend('HasSellUsedBook');
        var hasUsedBook = new HasSellUsedBook();
        hasUsedBook.save({//从UsedBook表获得被卖的二手书的信息转移到HasSellUsedBook表
            owner: avosUsedBook.get('owner'),
            des: avosUsedBook.get('des'),
            price: avosUsedBook.get('price'),
            isbn13: avosUsedBook.get('isbn13')
        }).done(function () {
            avosUsedBook.destroy().done(function () {//删除UsedBook表获得被卖的二手书
                response.success();
            }).fail(function (error) {
                response.error(error);
            })
        })
    }).fail(function (error) {
        response.error(error);
    })
});

