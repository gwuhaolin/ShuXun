/**
 * Created by wuhaolin on 5/1/15.
 * hook
 */
"use strict";
var AV = require('leanengine');
var Model = require('../../web/js/model.js');
var LBS = require('../util/lbs.js');
var WeChatAPI = require('../wechat/wechatAPI.js');
var BookInfo = require('../book/book-info.js');

AV.Cloud.afterSave('UsedBook', function (req) {
    var usedBook = req.object;
    var user = usedBook.get('owner');//图书主人
    user.fetch().done(function () {
        //设置二手书的地理位置
        var location = user.get('location');
        var point = new AV.GeoPoint(location);
        usedBook.set('location', point);
        usedBook.save();
    });
    //设置用户的二手书的relations
    user.relation('usedBooks').add(usedBook);
    user.save();
    //对接图书信息
    BookInfo.fillUsedBookInfo(usedBook).fail(function (err) {
        console.error(err);
    });
    //给用户的粉丝发送状态
    var status = new AV.Status(null, usedBook.get('des'));
    status.set('usedBook', usedBook);
    if (usedBook.get('role') == 'sell') {//上传二手书
        status.inboxType = 'newUsedBook';
    } else if (usedBook.get('role') == 'need') {//发布求书
        status.inboxType = 'newNeedBook';
    }
    AV.Status.sendStatusToFollowers(status, null);
});
AV.Cloud.beforeDelete('UsedBook', function (req, res) {
    //把当前usedBook从主人的relations的usedBooks属性中移除
    var usedBook = req.object;
    var owner = usedBook.get('owner');
    owner.relation('usedBooks').remove(usedBook);
    owner.save().done(function () {
        res.success();
    }).fail(function (err) {
        res.error(err);
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
    var query = new AV.Query(Model.School);
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
    if (role == 'buy') {
        url += '&role=sell';
    } else if (role == 'sell') {
        url += '&role=buy';
    }
    if (usedBook) {
        url += '&usedBookObjectId=' + usedBook.id;
        usedBook.fetch().always(function () {
            sendWechatMsgTo(status.get('to'));
        })
    } else {
        sendWechatMsgTo(status.get('to'));
    }

    /**
     * 调用微信接口发送出去
     * @param receiver 消息的接受者
     * @returns {AV.Promise}
     */
    function sendWechatMsgTo(receiver) {
        //生成title
        var bookTitle = usedBook ? usedBook.get('title') : '';
        if (inboxType == 'private') {//发私信
            if (role == 'sell') {
                title = bookTitle + '-主人回复了你的私信';
            } else if (role == 'buy') {
                title = bookTitle + '-有同学给你发私信';
            }
        } else if (inboxType == 'reviewUsedBook') {//评价二手书
            if (role == 'sell') {
                title = bookTitle + '-主人回复了你的评论';
            } else if (role == 'buy') {
                title = bookTitle + '-有同学对你的书发表了评论';
            }
        }
        var rePromise = new AV.Promise(null);
        if (receiver) {
            receiver.fetch().done(function () {
                var receiverOpenId = receiver.get('openId');
                if (receiverOpenId) {
                    var wechatAlert = receiver.get('wechatAlert');//用户自己设置的是否接受微信提醒
                    if (wechatAlert) {
                        WeChatAPI.sendTemplateMsg(title, senderName, msg, url, receiverOpenId).done(function (re) {
                            rePromise.resolve(re);
                        }).fail(function (err) {
                            rePromise.reject(err);
                        })
                    } else {
                        rePromise.reject('用户设置了不接受微信提醒,不能给他发消息');
                    }
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