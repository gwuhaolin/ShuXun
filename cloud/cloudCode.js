/**
 * Created by wuhaolin on 4/8/15.
 * AVOS 运代码
 */
"use strict";
var WechatAPI = require('cloud/wechatAPI.js');
var LBS = require('cloud/lbs.js');

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
 * 更新微信菜单
 * 微信菜单格式见 http://mp.weixin.qq.com/wiki/13/43de8269be54a0a6f64413e4dfa94f39.html
 */
AV.Cloud.define('updateWechatMenu', function (request, response) {
    var wechatMenu = {
        "button": [
            {
                "type": "view",
                "name": "买书",
                "url": "http://ishuxun.cn/wechat/"
            },
            {
                "type": "view",
                "name": "卖书",
                "url": "http://ishuxun.cn/wechat/#/tab/person/uploadOneUsedBook/"
            }
        ]
    };
    WechatAPI.APIClient.createMenu(wechatMenu, function (error, result) {
        if (error) {
            response.error(error);
        } else {
            response.success(result);
        }
    });
});

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

/**
 * 上传一本二手书时,把二手书的位置定为主人当前的位置
 */
AV.Cloud.beforeSave('UsedBook', function (request, response) {
    var location = request.user.get('location');
    var point = new AV.GeoPoint(location);
    request.object.set('location', point);
    request.object.save();
    response.success();
});

/**
 * 当一本二手书别卖出或者被删除时 它对应的主人上传的图片会被清除
 */
AV.Cloud.beforeDelete('UsedBook', function (request, response) {
    var query = new AV.Query('UsedBook');
    query.get(request.object.id).done(function (avosUsedBook) {
        var file = avosUsedBook.get('avosImageFile');
        if (file) {
            file.destroy().done(function () {
                response.success();
            }).fail(function (error) {
                response.error(error);
            })
        } else {//没有图片文件
            response.success();
        }
    }).fail(function (error) {
        response.error(error);
    })
});

/**
 * 更新学校对象的经纬度
 * @param avosSchool 学校的名称
 */
function updateSchoolLocation(avosSchool) {
    var name = avosSchool.get('name');
    LBS.getSchoolLocation(name, function (location) {
        var point = new AV.GeoPoint(location.lat, location.lng);
        avosSchool.set('location', point);
        avosSchool.save();
    })
}
/**
 * 避免添加重名的学校
 */
AV.Cloud.beforeSave('School', function (request, response) {
    var avosSchool = request.object;
    var query = new AV.Query('School');
    query.equalTo('name', avosSchool.get('name'));
    query.count().done(function (number) {
        if (number > 0) {
            response.error('这个学校已经添加了');
        } else {
            response.success();
        }
    });
});
/**
 * 当添加了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterSave('School', function (request, response) {
    var avosSchool = request.object;
    updateSchoolLocation(avosSchool);
    response.success();
});
/**
 * 当更新了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterUpdate('School', function (request, response) {
    var avosSchool = request.object;
    updateSchoolLocation(avosSchool);
    response.success();
});