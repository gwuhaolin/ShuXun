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
                    nickName: wechatInfo['nickname'],
                    sex: wechatInfo['sex'],
                    avatarUrl: wechatInfo['headimgurl']
                };
                callback(re);
            })
        };

    })

    .service('InfoService$', function ($rootScope, $http, $ionicModal) {
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

        /**
         * 开始上大学时间所有选项 ,6年前到今年
         * @type {Array}
         */
        this.startSchoolYearOptions = [];
        {
            var currentYear = new Date().getFullYear();
            for (var year = currentYear - 6; year <= currentYear; year++) {
                that.startSchoolYearOptions.push(year);
            }
        }

        /**
         * 为$scope注册选择学校modalView功能
         * @param $scope
         * @param schoolOnChooseCallback 当选中了一个学校时调用 返回选中的学校
         */
        this.registerChooseSchoolModalView = function ($scope, schoolOnChooseCallback) {
            $scope.InfoService$ = this;
            $ionicModal.fromTemplateUrl('temp/tool/chooseSchoolModalView.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.chooseSchoolModalView = modal;
            });
            $scope.schoolOnChoose = function (school) {
                schoolOnChooseCallback(school);
                $scope.chooseSchoolModalView.hide();
            };
        };

        /**
         * 为$scope注册选择学校modalView功能
         * @param $scope
         * @param majorOnChooseCallback 当选中了一个专业时调用 返回选中的专业
         */
        this.registerChooseMajorModalView = function ($scope, majorOnChooseCallback) {
            $scope.InfoService$ = this;
            //选中了专业
            $ionicModal.fromTemplateUrl('temp/tool/chooseMajorModalView.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.chooseMajorModalView = modal;
            });
            $scope.majorOnChoose = function (major) {
                majorOnChooseCallback(major);
                $scope.chooseMajorModalView.hide();
            };
        }

    })

    .service('User$', function ($rootScope, $ionicModal) {
        var that = this;
        var $scope = $rootScope.$new(true);

        /**
         * 一个用户所有具有的属性名称
         * @type {string[]}
         */
        var UserAttrNames = ['email', 'username', 'password', 'openId', 'nickName', 'avatarUrl', 'sex', 'school', 'major', 'startSchoolYear'];

        /**
         * 用户注册 用户名=Email
         * @param jsonUser json格式的用户信息
         * @returns {*|AV.Promise}
         */
        this.signUpWithJSONUser = function (jsonUser) {
            var user = that.jsonToAvosUser(jsonUser);
            user.set('username', jsonUser.email);
            return user.signUp(null);
        };

        /**
         * 获得当前AVOS用户,如果当前用户不存在返回null
         * @returns {*|AV.Object}
         */
        this.getCurrentAvosUser = function () {
            return AV.User.current();
        };

        /**
         * 获得当前JSON格式的用户,如果当前用户不存在返回null
         * @returns {null}
         */
        this.getCurrentJsonUser = function () {
            var avosUser = AV.User.current();
            if (avosUser) {
                return that.avosUserToJson(avosUser);
            }
            return null;
        };

        /**
         * 把AVOS User 转换为 json格式的UserInfo
         */
        this.avosUserToJson = function (avosUser) {
            var json = {};
            for (var i = 0; i < UserAttrNames.length; i++) {
                var attrName = UserAttrNames[i];
                json[attrName] = avosUser.get(attrName);
            }
            return json;
        };

        /**
         * 把 json格式的UserInfo 转换为 AVOS User
         */
        this.jsonToAvosUser = function (jsonUser) {
            var user = new AV.User();
            for (var i = 0; i < UserAttrNames.length; i++) {
                var attrName = UserAttrNames[i];
                user.set(attrName, jsonUser[attrName]);
            }
            return user;
        };

        /**
         * 提示用户登入
         * @param title 显示给用户的提示信息
         * @param onSuccess 当登入成功时调用 返回 AVOSUser
         */
        this.alertUserLoginModalView = function (title, onSuccess) {
            $ionicModal.fromTemplateUrl('temp/tool/userLoginModalView.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.userLoginModalView = modal;
                $scope.userLoginModalView.show();
            });
            $scope.title = title;
            $scope.loginInfo = {
                email: '',
                password: ''
            };
            $scope.submitOnClick = function () {
                AV.User.logIn($scope.loginInfo.email, $scope.loginInfo.password, {
                    success: function (avosUser) {
                        $scope.userLoginModalView.hide();
                        onSuccess(avosUser);
                    },
                    error: function (user, error) {
                        alert('登入失败:' + error.message);
                    }
                });
            }
        }
    });