/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
angular.module('AppService', [], null)

/**
 * 图书搜索,调用豆瓣接口
 */
    .service('SearchBook$', function ($rootScope, DoubanBook$) {
        /**
         * 目前正在搜索的关键字
         * @type {string}
         */
        this.keyword = '';
        /**
         * 已经搜索获得到的书
         * @type {Array}
         */
        this.books = [];
        /**
         * 还可以加载更多吗?
         * @type {boolean}
         */
        this.hasMore = function () {
            return this.books.length < this.totalNum;
        };
        /**
         * 该关键字一共检索到的书的数量
         * @type {number}
         */
        this.totalNum = 0;
        /**
         * 加载更多到books
         */
        var that = this;
        /**
         * 加载更多
         */
        this.loadMore = function () {
            if (that.keyword.length > 0) {
                DoubanBook$.searchBooks(that.keyword, that.books.length, 10, function (json) {
                    that.totalNum = json['total'];
                    var booksJSON = json['books'];
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.books.push(booksJSON[i]);
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            }
        }
    })

    .service('WeChatJS$', function ($rootScope) {
        //先配置好微信
        jsonp('/wechat/getJsConfig', function (json) {
            wx.config(json);
        });

        //分享出去时的数据
        this.shareData = {
            title: '分享标题',
            desc: '分享描述',
            link: '分享链接',
            imgUrl: '分享图标',
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        //分享到朋友圈
        wx.onMenuShareTimeline(this.shareData);
        //分享给朋友
        wx.onMenuShareAppMessage(this.shareData);
        //分享到QQ
        wx.onMenuShareQQ(this.shareData);
        //分享到腾讯微博
        wx.onMenuShareWeibo(this.shareData);

        /**
         * 调起微信扫一扫接口
         * @param callback
         * 返回ISBN码
         */
        this.scanQRCode = function (callback) {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                success: function (res) {
                    callback(res.resultStr.split(',')[1]);
                    $rootScope.$apply();
                }
            })
        };

        /**
         * 拍照或从手机相册中选图接口
         * @param callback
         * 返回图片的本地src
         * TODO 选择后src属性预览不了
         */
        this.chooseImage = function (callback) {
            wx.chooseImage({
                success: function (res) {
                    callback(res.localIds[0]);
                    $rootScope.$apply();
                }
            });
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
            $rootScope.$apply();
        };

        /**
         * 直接生成引导用户Web OAuth点击的URL
         */
        this.getOAuthURL = function () {
            var redirectUrl = location.href.split('#')[0] + '#tab/person/signUp';
            return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WECHAT.AppID + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';
        };

        /**
         * 用户Web OAuth后
         * 获取Openid
         * @param code
         * @param callback
         * 返回 已经关注了用户的微信提供的所有信息
         */
        this.getOAuthUserInfo = function (code, callback) {
            jsonp('/wechat/getOAuthUserInfo/' + code, function (wechatInfo) {
                var re = {
                    openId: wechatInfo['openid'],
                    nickName:wechatInfo['nickname'],
                    sex:wechatInfo['sex'],
                    avatarUrl:wechatInfo['headimgurl']
                };
                callback(re);
            })
        };

    })

    .service('InfoService$', function ($rootScope, $http) {
        var that = this;
        /**
         * 所有的专业
         * @type {Array}
         */
        this.majors = [];
        //加载所有专业信息
        $http.jsonp('/info/getAllMajor?callback=JSON_CALLBACK').success(function (majors) {
            that.majors = majors;
        });
        /**
         * 搜索专业时的关键字
         * @type {string}
         */
        this.searchMajorKeyword = '';
        /**
         * 搜索专业时的过滤器
         * @param major 当前专业信息
         * @returns {boolean} 是否合格
         */
        this.filter_majorByKeyword = function (major) {
            return major['name'].indexOf(that.searchMajorKeyword) > -1;
        };

        /**
         * 所有的加载了的学校
         * @type {Array}
         */
        this.schools = [];
        $http.jsonp('/info/getAllSchool?callback=JSON_CALLBACK').success(function (schools) {
            that.schools = schools;
        });
        /**
         * 搜索学校时的关键字
         * @type {string}
         */
        this.searchSchoolKeyword = '';
        /**
         * 搜索专业时的过滤器
         * @param school 当前学校信息
         * @returns {boolean} 是否合格
         */
        this.filter_schoolByKeyword = function (school) {
            return school['name'].indexOf(that.searchSchoolKeyword) > -1;
        };

    })

    .service('User$', function () {

        /**
         * 用户注册
         * @param openId 微信id
         * @param nickName 微信昵称
         * @param avatarUrl 微信头像
         * @param major 专业
         * @param school 学校
         * @param startSchoolYear 大学入学时间
         * @returns {*|AV.Promise}
         */
        this.signUp = function (openId, nickName, avatarUrl, major, school, startSchoolYear) {
            var user = new AV.User();
            user.setUsername(openId, null);
            user.setPassword(openId, null);
            user.set('nickName', nickName);
            user.set('avatarUrl', avatarUrl);
            user.set('startSchoolYear', startSchoolYear);
            user.set('school', school);
            user.set('major', major);
            return user.signUp(null);
        }


    });