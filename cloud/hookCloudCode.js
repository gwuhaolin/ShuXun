/**
 * Created by wuhaolin on 5/1/15.
 *
 */
"use strict";
var LBS = require('cloud/lbs.js');
var WeChatAPI = require('cloud/wechatAPI.js');

AV.Cloud.afterSave('UsedBook', function (req) {
    var user = req.user;
    //设置二手书的地理位置
    var location = user.get('location');
    var point = new AV.GeoPoint(location);
    req.object.set('location', point);
    req.object.save();
    //设置用户的二手书的relations
    user.relation('usedBooks').add(req.object);
    user.save();
});
AV.Cloud.beforeDelete('UsedBook', function (req, res) {
    //把当前usedBook从主人的usedBooks属性中移除
    var user = req.user;
    user.relation('usedBooks').remove(req.object);
    user.save().done(function () {
        res.success();
    }).fail(function (err) {
        res.err(err);
    });
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
AV.Cloud.beforeSave('School', function (req, res) {
    var avosSchool = req.object;
    var query = new AV.Query('School');
    query.equalTo('name', avosSchool.get('name'));
    query.count().done(function (number) {
        if (number > 0) {
            res.error('这个学校已经添加了');
        } else {
            res.success();
        }
    });
});
/**
 * 当添加了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterSave('School', function (req) {
    var avosSchool = req.object;
    updateSchoolLocation(avosSchool);
});
/**
 * 当更新了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterUpdate('School', function (req, res) {
    var avosSchool = req.object;
    updateSchoolLocation(avosSchool);
    res.success();
});

/**
 * 再用户发送了一条状态后,更具内容使用微信模板消息发送对应的消息通知
 */
AV.Cloud.afterSave('_Status', function (req) {
    var sender = req.user;
    var status = req.object;
    var inboxType = status.get('inboxType'),
        senderName = sender.get('nickName'),
        msg = status.get('message');
    var role = status.get('role'),//当前发送者的角色sell buy
        usedBook = status.get('usedBook');//在 私信,评论二手书时 才有
    var url = 'http://www.ishuxun.cn/wechat/#/tab/person/sendMsgToUser?receiverObjectId=' + sender.id + '&inboxType=' + inboxType,
        title;
    if (usedBook) {
        url += '&usedBookObjectId=' + usedBook.id;
    }
    if (role == 'buy') {
        url += '&role=sell';
    } else if (role == 'sell') {
        url += '&role=buy';
    }
    if (inboxType == 'private') {//发私信
        if (role == 'sell') {
            title = '主人回复了你的私信';
        } else if (role == 'buy') {
            title = '有同学对你的书感兴趣,给你发了私信';
        }
        sendWechatMsgTo(status.get('to'));
    } else if (inboxType == 'reviewUsedBook') {//评价二手书
        usedBook.fetch().done(function () {
            var bookTitle = usedBook.get('title');
            if (role == 'sell') {
                title = '主人回复了你对 ' + bookTitle + ' 的评论';
            } else if (role == 'buy') {
                title = '有同学对你的 ' + bookTitle + ' 发表了评论';
            }
            sendWechatMsgTo(status.get('to'));
        });
    }

    /**
     * 调用微信接口发送出去
     * @param receiver 消息的接受者
     * @returns {AV.Promise}
     */
    function sendWechatMsgTo(receiver) {
        var rePromise = new AV.Promise(null);
        if (receiver) {
            receiver.fetch().done(function () {
                var receiverOpenId = receiver.get('openId');
                if (receiverOpenId) {
                    rePromise = WeChatAPI.sendTemplateMsg(title, senderName, msg, url, receiverOpenId);
                } else {
                    rePromise.reject('对方还没有关注书循,不能给他发消息');//获取不到openID
                }
            }).fail(function (err) {
                rePromise.reject(err);
            })
        } else {
            rePromise.reject('消息接收者不能为空');
        }
        return rePromise;
    }
});