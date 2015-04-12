/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
angular.module('AppService', [], null)

/**
 * 图书搜索,调用豆瓣接口
 */
    .service('SearchBook$', function ($rootScope, DoubanBook$, $timeout) {
        var that = this;
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
        };
        /**
         * 用于延迟自动提示
         * @type {null}
         */
        var timer = null;
        /**
         * 当搜索按钮被点击时
         */
        this.searchBtnOnClick = function () {
            that.loadMore();
            $timeout.cancel(timer);
        };
        /**
         * 当搜索框的关键字改变时
         */
        this.searchInputOnChange = function () {
            that.books = [];
            that.totalNum = 0;
            $timeout.cancel(timer);
            timer = $timeout(function () {
                that.searchBtnOnClick();
            }, 1000);
        };
    })

    .service('BusinessSite$', function () {
        // 电商联盟的logo 图书价格 电商联盟的名称 商品的购买链接
        var InfoAttrName = ['imageUrl', 'price', 'siteName', 'siteUrl'];

        /**
         * 获得对应的ISBN号码的图书在各大电商平台的价格信息
         * @param isbn13
         * @param callback 返回获得的信息
         */
        this.getBusinessInfoByISBN = function (isbn13, callback) {
            //TODO 获取联盟数据的后台待实现
            callback();
        }
    })

    .service('WeChatJS$', function ($rootScope) {
        var that = this;
        //先配置好微信
        jsonp('/wechat/getJsConfig', function (json) {
            wx.config(json);
        });

        //分享出去时的数据 TODO 分享内容待修改 IOS上没有分享logo
        /**
         * 获得微信分享接口时需要的参数
         * @param json 附加的参数
         */
        function getShareData(json) {
            var re = {
                title: document.title,
                desc: '关于书循的介绍',
                link: window.location.href,
                imgUrl: 'http://' + window.location.host + '/img/logo-R.png'
            };
            re = angular.extend(re, json);
            return re;
        }

        //获得用户目前地理位置
        wx.getLocation({
            success: function (res) {
                that.location = res;//latitude; // 纬度，浮点数，范围为90 ~ -90 longitude; // 经度，浮点数，范围为180 ~ -180。// 速度，以米/每秒计 // 位置精度
            }
        });

        //分享到朋友圈
        wx.onMenuShareTimeline(getShareData());
        //分享给朋友
        wx.onMenuShareAppMessage(getShareData());
        //分享到QQ
        wx.onMenuShareQQ(getShareData());
        //分享到腾讯微博
        wx.onMenuShareWeibo(getShareData());

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
         * 返回图片的localId
         * localId可以作为img标签的src属性显示图片
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

        /**
         * 上传图片接口
         * @param localId 需要上传的图片的本地ID，由chooseImage接口获得
         * @param callback 返回图片的服务器端ID
         */
        this.uploadImage = function (localId, callback) {
            wx.uploadImage({
                localId: localId,
                success: function (res) {
                    var serverId = res.serverId;
                    callback(serverId);
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

        /**
         * 开始上大学时间所有选项 ,6年前到今年
         * @type {Array}
         */
        this.startSchoolYearOptions = [];
        {
            var currentYear = new Date().getFullYear();
            for (var year = currentYear - 6; year <= currentYear; year++) {
                that.startSchoolYearOptions.push(year.toString());
            }
        }

    })

    .service('IonicModalView$', function ($rootScope, $ionicModal, InfoService$, WeChatJS$) {

        /**
         * 为$scope注册选择学校modalView功能
         * @param $scope
         * @param schoolOnChooseCallback 当选中了一个学校时调用 返回选中的学校
         */
        this.registerChooseSchoolModalView = function ($scope, schoolOnChooseCallback) {
            $scope.InfoService$ = InfoService$;
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
            $scope.InfoService$ = InfoService$;
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
        };

        /**
         * 弹出详细文本信息
         * @param title 标题
         * @param pre 要放在pre里显示的内容
         */
        this.alertTitleAndPreModalView = function (title, pre) {
            var $scope = $rootScope.$new(true);
            $scope.titleAndPreModalViewData = {
                title: title,
                pre: pre
            };
            $ionicModal.fromTemplateUrl('temp/tool/titleAndPreModalView.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.titleAndPreModalView = modal;
                modal.show();
            });
        };

        /**
         * 提示用户登入
         * @param title 显示给用户的提示信息
         * @param onSuccess 当登入成功时调用 返回 AVOSUser
         */
        this.alertUserLoginModalView = function (title, onSuccess) {
            var $scope = $rootScope.$new(true);
            $scope.WeChatJS$ = WeChatJS$;
            $ionicModal.fromTemplateUrl('temp/tool/userLoginModalView.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.userLoginModalView = modal;
                $scope.userLoginModalView.show();
            });
            $scope.title = title;
            $scope.loginInfo = {
                email: AV.User.current() == null ? '' : AV.User.current().getCurrentJsonUser().email,
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

    })

    .service('User$', function (IonicModalView$) {
        var that = this;

        /**
         * 一个用户所有具有的属性名称
         * @type {string[]}
         */
        var UserAttrNames = ['email', 'username', 'password', 'openId', 'unionId', 'nickName', 'avatarUrl', 'sex', 'school', 'major', 'startSchoolYear'];

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
            var avosUser = that.getCurrentAvosUser();
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
            json.objectId = avosUser.id;
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
         * 检测用户是否已经登录了,没有的话提示用户登录
         * @param onSuccess 当用户登录成功时
         */
        this.checkUsedHasLogin = function (onSuccess) {
            if (!that.getCurrentAvosUser()) {
                IonicModalView$.alertUserLoginModalView('你还没有登录', onSuccess);
            }
        }

    })

    //还没有卖出的二手书
    .service('UsedBook$', function ($rootScope, HasSellUsedBook$) {
        var that = this;
        var UsedBookAttrNames = ['owner', 'isbn13', 'avosImageFile', 'price', 'des'];

        /**
         * 是否正在加载数据
         * @type {boolean}
         */
        this.isLoading = false;

        /**
         * 获得这位主人还没有卖出的二手书的数量
         * @param avosUser
         * @returns {*|AV.Promise}
         */
        this.getUsedBookNumberForOwner = function (avosUser) {
            var query = new AV.Query('UsedBook');
            query.equalTo("owner", avosUser);
            query.descending("updatedAt");
            return query.count();
        };

        /**
         * 加载对应用户所有还没有卖出的二手书
         * @param avosUser
         * @returns {*|AV.Promise}
         */
        this.loadUsedBookListForOwner = function (avosUser) {
            var query = new AV.Query('UsedBook');
            query.equalTo('owner', avosUser);
            query.descending("updatedAt");
            return query.find();
        };

        /**
         * 所有我上传的还没有卖出的二手书
         * @type {Array}
         */
        this.myAvosUsedBookList = [];
        /**
         * 加载所有我上传的二手书
         */
        this.loadMyAvosUsedBookList = function () {
            that.isLoading = true;
            var query = new AV.Query('UsedBook');
            query.equalTo('owner', AV.User.current());
            query.descending("updatedAt");
            query.find().done(function (avosUsedBooks) {
                that.myAvosUsedBookList = avosUsedBooks;
            }).always(function () {
                that.isLoading = false;
                $rootScope.$apply();
            })
        };

        /**
         * 删除一本没有卖出的二手书
         * @param avosUsedBook
         */
        this.removeUsedBook = function (avosUsedBook) {
            if (window.confirm('你确定要删除它吗?')) {
                avosUsedBook.destroy().done(function () {
                    that.loadMyAvosUsedBookList();
                }).fail(function (error) {
                    alert(error.message);
                })
            }
        };

        /**
         * 把一本二手书设置为已经卖出
         * @param avosUsedBook
         */
        this.usedBookHasSell = function (avosUsedBook) {
            if (window.confirm('你确定它已经卖出了吗?')) {
                AV.Cloud.run('usedBookHasSell', {
                    id: avosUsedBook.id
                }, null).done(function () {
                    that.loadMyAvosUsedBookList();
                    HasSellUsedBook$.loadMyAvosUsedBookList();
                }).fail(function (error) {
                    alert(error.message);
                });
            }
        };

        /**
         * 把AVOS的UsedBook转换为JSON格式的
         */
        this.avosUsedBookToJson = function (avosUsedBook) {
            var json = {};
            for (var i = 0; i < UsedBookAttrNames.length; i++) {
                var attrName = UsedBookAttrNames[i];
                json[attrName] = avosUsedBook.get(attrName);
            }
            json.objectId = avosUsedBook.id;
            json.updatedAt = avosUsedBook.updatedAt;
            return json;
        };

        /**
         * 把JSON格式的UsedBook转换为AVOS格式的
         */
        this.jsonUsedBookToAvos = function (jsonUsedBook) {
            var UsedBook = new AV.Object.extend("UsedBook");
            var usedBook = new UsedBook();
            for (var i = 0; i < UsedBookAttrNames.length; i++) {
                var attrName = UsedBookAttrNames[i];
                usedBook.set(attrName, jsonUsedBook[attrName]);
            }
            return usedBook;
        };

        /**
         * 用AVOS的 objectID 获得JSON格式的二手书信息
         */
        this.getJsonUsedBookByAvosObjectId = function (avosObjectId, callback) {
            var query = new AV.Query('UsedBook');
            query.get(avosObjectId).done(function (avosUsedBook) {
                callback(that.avosUsedBookToJson(avosUsedBook));
            })
        };

        /**
         * 获得对应ISBN的二手书一共有多少本
         * @param isbn13
         * @returns {*|AV.Promise}
         */
        this.getUsedBookNumberEqualISBN = function (isbn13) {
            var query = new AV.Query('UsedBook');
            query.equalTo("isbn13", isbn13);
            return query.count();
        };

        /**
         * 目前正在加载的二手书的ISBN号码
         * @type {string}
         */
        var nowISBN13 = '';
        /**
         * 目前已经加载了对应的ISBN号码的二手书列表
         * @type {Array}
         */
        this.nowEqualISBNAvosUsedBookList = [];
        /**
         * 获得所有对应ISBN的二手书
         * @param isbn13
         */
        this.loadMoreAvosUsedBookEqualISBN = function (isbn13) {
            that.isLoading = true;
            if (isbn13 != nowISBN13) {//如果是新的ISBN号码就清空以前的
                nowISBN13 = isbn13;
                that.nowEqualISBNAvosUsedBookList = [];
            }
            var query = new AV.Query('UsedBook');
            query.equalTo("isbn13", nowISBN13);
            query.descending("updatedAt");
            query.skip(that.nowEqualISBNAvosUsedBookList.length);
            query.limit(5);
            query.find().done(function (avosUsedBooks) {
                that.nowEqualISBNAvosUsedBookList = that.nowEqualISBNAvosUsedBookList.concat(avosUsedBooks);
            }).always(function () {
                that.isLoading = false;
                $rootScope.$apply();
            })
        }

    })

    //已经卖出的二手书
    .service('HasSellUsedBook$', function ($rootScope) {
        var that = this;
        /**
         * 所有我上传的还已经卖出的二手书
         * @type {Array}
         */
        this.myAvosUsedBookList = [];

        /**
         * 加载所有我已经卖出二手书到myAvosUsedBookList
         */
        this.loadMyAvosUsedBookList = function () {
            var query = new AV.Query('HasSellUsedBook');
            query.equalTo('owner', AV.User.current());
            query.find().done(function (avosUsedBooks) {
                that.myAvosUsedBookList = avosUsedBooks;
            }).always(function () {
                $rootScope.$apply();
            })
        };

        /**
         * 删除一本已经卖出的二手书
         * @param avosUsedBook
         */
        this.removeUsedBook = function (avosUsedBook) {
            if (window.confirm('你确定要删除它吗?')) {
                avosUsedBook.destroy().done(function () {
                    that.loadMyAvosUsedBookList();
                }).fail(function (error) {
                    alert(error.message);
                })
            }
        };
    });