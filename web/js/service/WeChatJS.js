/**
 * Created by wuhaolin on 5/20/15.
 * 微信js接口
 */
"use strict";

APP.service('WeChatJS$', function ($rootScope) {
    var that = this;
    //先配置好微信
    this.config = function () {
        AV.Cloud.run('getWechatJsConfig', {
            url: location.href.split('#')[0]
        }, null).done(function (json) {
            wx.config(json);
        });
    };

    //分享出去时的数据
    /**
     * 获得微信分享接口时需要的参数
     * @param json 附加的参数
     */
    function getShareData(json) {
        var re = {
            title: '书循',
            desc: '让你的课本重复利用',
            link: window.location.href,
            imgUrl: 'http://' + window.location.host + '/wechat/img/logo-R.png'
        };
        re = angular.extend(re, json);
        return re;
    }

    wx.ready(function () {
        //分享到朋友圈
        wx.onMenuShareTimeline(getShareData());
        //分享给朋友
        wx.onMenuShareAppMessage(getShareData());
        //分享到QQ
        wx.onMenuShareQQ(getShareData());
        //分享到腾讯微博
        wx.onMenuShareWeibo(getShareData());
        //更新用户的经纬度
        wx.getLocation({
            success: function (res) {
                AV.Cloud.run('updateMyLocation', {
                    latitude: res.latitude,
                    longitude: res.longitude
                }, null);
            },
            fail: function () {//使用IP地址地位
                AV.Cloud.run('updateMyLocation', null, null);
            },
            cancel: function () {//使用IP地址地位
                AV.Cloud.run('updateMyLocation', null, null);
            }
        });
    });

    wx.error(function () {
        that.config();
    });


    /**
     * 调起微信扫一扫接口
     * @param callback
     * 返回ISBN码
     */
    this.scanQRCode = function (callback) {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["barCode"],// 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                callback(res.resultStr.split(',')[1]);
                $rootScope.$apply();
            }
        })
    };

    /***
     * 预览一张图片
     * @param imgUrl 图片的URL
     */
    this.previewOneImage = function (imgUrl) {
        wx.previewImage({
            current: imgUrl,
            urls: [imgUrl]
        });
    };

    /**
     * 直接生成引导用户Web OAuth点击的URL
     */
    this.getOAuthURL = function () {
        var redirectUrl = location.href.split('#')[0] + '#/tab/signUp';
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WECHAT.AppID + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_base&state=#wechat_redirect';
    };

    /**
     * 用户Web OAuth后
     * 获取Openid
     * @param code
     * @param onSuccess
     * @param onError
     * 返回 已经关注了用户的微信提供的所有信息
     */
    this.getOAuthUserInfo = function (code, onSuccess, onError) {
        AV.Cloud.run('getWechatOAuthUserInfo', {
            code: code
        }, null).done(function (wechatInfo) {
            var re = {
                openId: wechatInfo['openid'],
                unionId: wechatInfo['unionid'],
                nickName: wechatInfo['nickname'],
                sex: wechatInfo['sex'],
                avatarUrl: wechatInfo['headimgurl']
            };
            createCookie('unionId', re.unionId, 365);
            onSuccess(re);
        }).fail(function (err) {
            onError && onError(err);
        });
    };

    /**
     * 调用微信接口显示地图
     * @param latitude
     * @param longitude
     */
    this.openMap = function (latitude, longitude) {
        //调用腾讯lbs API把GPS经纬度转换为腾讯地图经纬度
        jsonp('http://apis.map.qq.com/ws/coord/v1/translate?type=1&key=R3DBZ-HEYRF-ZSZJ3-JAJJN-2ZWFF-SLBJV&output=jsonp&locations=' + latitude + ',' + longitude, function (json) {
            if (json.status == 0) {
                var location = json['locations'][0];
                wx.openLocation({
                    latitude: location.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: location.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: '该同学位置' // 位置名
                });
            }
        });
    }

});