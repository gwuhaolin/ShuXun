/**
 * Created by wuhaolin on 4/11/15.
 *
 */
"use strict";
var Wechat = require('wechat');
var WechatAPI = require('cloud/wechatAPI.js');
var DoubanBook = require('cloud/doubanBook.js');
var config = {
    token: WechatAPI.Config.Token,
    appid: WechatAPI.Config.AppID,
    encodingAESKey: WechatAPI.Config.EncodingAESKey
};

exports.MsgHandler = Wechat(config)
    .text(function (message, req, res) {//文字
        var context = message['Content'];
        searchBookFromDouban(context, res);
    }).voice(function (message, req, res) {//语音
        var recognition = message['Recognition'];
        searchBookFromDouban(recognition, res);
    }).image(function (message, req, res) {//图片
        res.reply('你的反馈已经收到,我们会尽快处理好');
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
                res.reply('');
                return;
            case 'subscribe'://关注事件 TODO 发送使用说明和书循介绍
                res.reply('书循,让你的课本循环利用');
                return;
            case 'unsubscribe'://取消关注事件
                res.reply('');
                return;
            case 'SCAN'://用户已关注时扫描带参数二维码事件事件推送
                res.reply('');
                return;
            case 'CLICK'://用户点击自定义菜单后
                res.reply('');
                return;
            case 'VIEW'://点击菜单跳转链接时的事件推送
                res.reply('');
                return;
        }
    }).middlewarify();

/**
 * 调用豆瓣图书接口按照关键字搜索书
 * @param keyword 搜索关键字
 * @param res 微信消息回应函数
 */
function searchBookFromDouban(keyword, res) {
    DoubanBook.searchBook(keyword).done(function (books) {
        if (books.length > 0) {
            var re = [];
            for (var i = 0; i < books.length; i++) {
                re.push(ReplyMaker.oneImageAndText(books[i].title, books[i].image, books[i].url));
            }
            res.reply(re);
        } else {
            res.reply('没有找到和 ' + keyword + ' 相关的书,来<a href="http://www.ishuxun.cn/wechat/#/tab/book/searchList/">这里试试看</a>');
        }
    }).fail(function (err) {
        console.error(err);
        res.reply('');
    });
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
     * @param picurl 图片链接，支持JPG、PNG格式，较好的效果为大图360*200，小图200*200
     * @param url 点击图文消息跳转链接
     */
    oneImageAndText: function (title, picurl, url) {
        return {
            title: title,
            description: '',
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