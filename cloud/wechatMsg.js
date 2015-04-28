/**
 * Created by wuhaolin on 4/11/15.
 *
 */
"use strict";
var Request = require('request');
var Wechat = require('wechat');
var WechatAPI = require('cloud/wechatAPI.js');
var config = {
    token: WechatAPI.Config.Token,
    appid: WechatAPI.Config.AppID,
    encodingAESKey: WechatAPI.Config.EncodingAESKey
};

exports.MsgHandler = Wechat(config)
    .text(function (message, req, res) {//文字
        var context = message['Content'];
        compute(context).done(function (re) {
            res.reply(re);
        }).fail(function () {
            res.reply('');
        });
    }).voice(function (message, req, res) {//语音
        var recognition = message['Recognition'];
        compute(recognition).done(function (re) {
            res.reply(re);
        }).fail(function () {
            res.reply('');
        });
    }).image(function (message, req, res) {//图片
        res.reply('');
    }).video(function (message, req, res) {//视频
        res.reply('');
    }).location(function (message, req, res) {//地理位置
        res.reply('');
    }).link(function (message, req, res) {//链接
        res.reply('');
    }).event(function (message, req, res) {//事件
        switch (message['Event']) {
            case 'LOCATION'://上报地理位置事件
                var openId = message['FromUserName'];
                var lat = message['Latitude'];
                var lon = message['Longitude'];
                saveLocationToUser(openId, lat, lon);
                return;
            case 'subscribe'://关注事件
                res.reply('书循,让你的课本循环利用');
                return;
            case 'unsubscribe'://取消关注事件
                return;
            case 'SCAN'://用户已关注时扫描带参数二维码事件事件推送
                return;
            case 'CLICK'://用户点击自定义菜单后
                return;
            case 'VIEW'://点击菜单跳转链接时的事件推送
                return;
        }
    }).middlewarify();

/**
 * 对用户提成的问题进行计算回复
 * @param queryText 提成的问题的文字描述
 * @return AV.Promise 成功的话会返回 可直接返回的json
 */
function compute(queryText) {
    var promise = new AV.Promise(null);

    //搜索图书
    searchBook(queryText).done(function (re) {
        promise.resolve(re);
    }).fail(function (err) {
        promise.reject(err);
    });

    return promise;
}

/**
 * 调用豆瓣图书接口按照关键字搜索书
 * @param keyword 搜索关键字
 * @returns {AV.Promise} 如果成功返回可以直接回复给用户的json数组,没有找到书时返回的json数组长度为0
 */
function searchBook(keyword) {
    var promise = new AV.Promise(null);
    Request.get({
        url: 'https://api.douban.com/v2/book/search',
        qs: {
            q: keyword,
            count: 10,
            fields: 'author,pubdate,image,publisher,title,price,isbn13'
        }
    }, function (err, res, body) {
        if (err) {
            promise.reject(err);
        } else {
            var re = [];
            var json = JSON.parse(body);
            var total = json.total;
            if (total > 0) {//找到了对于的书
                var books = json.books;
                for (var i = 0; i < books.length && i < 9; i++) {//最多9本书
                    var title = books[i].title;
                    var des = books[i].price + '元 ' + books[i].author.toString() + '著 ' + books[i]['publisher'] + '|' + books[i]['pubdate'];
                    var bookUrl = 'http://ishuxun.cn/wechat/#/tab/book/oneBook/' + books[i].isbn13;
                    re.push(ReplyMaker.oneImageAndText(title, des, books[i].image, bookUrl));
                }
                if (total > 9) {//因为微信最多可以显示10本,当有的书大于9本时为用户提供显示更多
                    re.push(ReplyMaker.oneImageAndText('还有剩下' + (total - json.count) + '本相关的书', '点击查看所有相关的书', 'http://ishuxun.cn/wechat/img/logo.png', 'http://ishuxun.cn/wechat/#/tab/book/searchList/' + keyword));
                }
            }
            promise.resolve(re);
        }
    });
    return promise;
}

/**
 * 生成回复内容
 */
var ReplyMaker = {
    /**
     * 回复文本
     * @param context 回复的消息内容（换行：在content中能够换行，微信客户端就支持换行显示）
     */
    text: function (context) {
        return {
            type: "text",
            content: context
        }
    },

    /**
     * 回复图片
     * @param mediaId 要用于回复的图片在微信服务里的id
     */
    image: function (mediaId) {
        return {
            type: "image",
            content: {
                mediaId: mediaId
            }
        }
    },

    /**
     * 回复语音
     * @param mediaId 通过上传多媒体文件，得到的id
     */
    voice: function (mediaId) {
        return {
            type: "voice",
            content: {
                mediaId: mediaId
            }
        }
    },

    /**
     * 回复视频
     * @param title 视频消息的标题
     * @param description 视频消息的描述
     * @param mediaId 通过上传多媒体文件，得到的id
     */
    video: function (title, description, mediaId) {
        return {
            type: "video",
            content: {
                title: title,
                description: description,
                mediaId: mediaId
            }
        }
    },

    /**
     * 回复音乐
     * @param title 音乐标题
     * @param description 音乐描述
     * @param musicUrl 音乐链接
     * @param hqMusicUrl 高质量音乐链接，WIFI环境优先使用该链接播放音乐
     * @param thumbMediaId 缩略图的媒体id，通过上传多媒体文件，得到的id
     */
    music: function (title, description, musicUrl, hqMusicUrl, thumbMediaId) {
        return {
            title: title,
            description: description,
            musicUrl: musicUrl,
            hqMusicUrl: hqMusicUrl,
            thumbMediaId: thumbMediaId
        }
    },

    /**
     * 生成一条图文
     * @param title 图文消息标题
     * @param description 图文消息描述
     * @param picurl 图片链接，支持JPG、PNG格式，较好的效果为大图360*200，小图200*200
     * @param url 点击图文消息跳转链接
     */
    oneImageAndText: function (title, description, picurl, url) {
        return {
            title: title,
            description: description,
            picurl: picurl,
            url: url
        }
    }
};

/**
 * 把用户上报的地理位置记录到AVOS
 * @param userOpenId 用户的微信平台的openID
 * @param lat 经度
 * @param lon 纬度
 */
function saveLocationToUser(userOpenId, lat, lon) {
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    var query = new AV.Query(AV.User);
    query.equalTo('openId', userOpenId);
    query.first().done(function (avosUser) {
        if (avosUser) {
            var point = new AV.GeoPoint(lat, lon);
            avosUser.set('location', point);
            avosUser.save();
        }
    })
}