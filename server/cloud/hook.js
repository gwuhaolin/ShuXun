/**
 * Created by wuhaolin on 5/1/15.
 * hook
 */
"use strict";
var AV = require('leanengine');
var Model = require('../../web/js/model.js');
var LBS = require('../util/lbs.js');
var SEO = require('../util/seo.js');
var WeChatAPI = require('../wechat/wechatAPI.js');
var BookInfo = require('../book/book-info.js');

AV.Cloud.afterSave('UsedBook', function (req) {
    var usedBook = req.object;
    var user = usedBook.get('owner');//图书主人
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
    var usedBookRole = usedBook.get('role');
    if (usedBookRole === 'sell') {//上传二手书
        status.inboxType = 'newUsedBook';
    } else if (usedBookRole === 'need') {//发布求书
        status.inboxType = 'newNeedBook';
    } else if (usedBookRole === 'circle') {
        status.inboxType = 'newCircleBook';
    }
    AV.Status.sendStatusToFollowers(status, null);

    //SEO
    SEO.baiduLinkCommit('http://www.ishuxun.cn/desktop/#!/book/one-used-book/?usedBookAvosObjectId=' + usedBook.id);
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

AV.Cloud.afterSave('BookInfo', function (req) {
    var bookInfo = req.object;
    //SEO
    SEO.baiduLinkCommit('http://www.ishuxun.cn/desktop/#!/book/one-book/?isbn13=' + bookInfo.get('isbn13'));
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
    var receiver = status.get('to');
    var inboxType = status.get('inboxType'),
        senderName = sender.get('nickName'),
        msg = status.get('message');
    var usedBook = status.get('usedBook');//在 私信,评论二手书时 才有
    var url = 'http://www.ishuxun.cn/wechat/#/person/send-msg-to-user?receiverObjectId=' + sender.id + '&inboxType=' + inboxType,
        title;
    if (receiver) {//如果是用户上传了新的UsedBook触发了Status事件那么Status就不会有to属性 receiver就为null 这里就不会发送微信消息
        if (usedBook) {
            url += '&usedBookObjectId=' + usedBook.id;
            var query = new AV.Query(Model.UsedBook);
            query.include('bookInfo');
            query.get(usedBook.id).always(function (fetchUsedBook) {
                usedBook = fetchUsedBook;
                var usedBookIsReceiver = usedBook.get('owner').id === receiver.id;
                var bookInfo = fetchUsedBook.get('bookInfo');
                var bookTitle = bookInfo ? bookInfo.get('title') : '';
                var usedBookRole = usedBook.get('role');
                if (inboxType == 'private') {//发私信
                    if (usedBookIsReceiver) {
                        if (usedBookRole === 'sell') {
                            title = '有同学对你要卖的旧书 ' + bookTitle + ' 感兴趣';
                        } else if (usedBookRole === 'need') {
                            title = '有同学回应你发布的求书 ' + title;
                        } else if (usedBookRole === 'circle') {
                            title = '有同学对你发布的书漂流 ' + bookTitle + ' 感兴趣';
                        }
                    } else {
                        if (usedBookRole === 'sell') {
                            title = '旧书 ' + bookTitle + ' 的主人回复了你';
                        } else if (usedBookRole === 'need') {
                            title = '发布求书 ' + bookTitle + '的同学回复了你';
                        } else if (usedBookRole === 'circle') {
                            title = '发布书漂流 ' + bookTitle + ' 的同学回复了你';
                        }
                    }
                } else if (inboxType == 'reviewUsedBook') {//评价二手书
                    if (usedBookIsReceiver) {
                        if (usedBookRole === 'sell') {
                            title = '有同学对你要卖的旧书 ' + bookTitle + ' 发表了评价';
                        } else if (usedBookRole === 'need') {
                            title = '有同学对你发布的求书 ' + bookTitle + ' 发表了评价';
                        } else if (usedBookRole === 'circle') {
                            title = '有同学对你发布的书漂流 ' + bookTitle + ' 发表了评价';
                        }
                    } else {
                        if (usedBookRole === 'sell') {
                            title = '旧书 ' + bookTitle + ' 的主人回复了你的评价';
                        } else if (usedBookRole === 'need') {
                            title = '发布求书 ' + bookTitle + '的同学回复了你的评价';
                        } else if (usedBookRole === 'circle') {
                            title = '发布书漂流 ' + bookTitle + ' 的同学回复了你的评价';
                        }
                    }
                }
                sendOutWechatMsg();
            });
        } else {
            if (inboxType == 'private') {//发私信
                title = '有同学给你发私信';
            }
            sendOutWechatMsg();
        }
    }

    /**
     * 调用微信接口发送出去
     * @returns {AV.Promise}
     */
    function sendOutWechatMsg() {
        url += '&title=' + title;
        receiver.fetch().done(function () {
            var receiverOpenId = receiver.get('openId');
            if (receiverOpenId) {
                var wechatAlert = receiver.get('wechatAlert');//用户自己设置的是否接受微信提醒
                if (wechatAlert) {
                    WeChatAPI.sendTemplateMsg(title, senderName, msg, url, receiverOpenId).fail(function (err) {
                        console.error(err);
                    })
                }
            }
        }).fail(function (err) {
            console.error(err);
        })
    }
});