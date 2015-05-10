/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
/**
 * 豆瓣图书接口
 */
APP.service('DoubanBook$', function ($rootScope) {
    var that = this;
    var baseUri = 'http://api.douban.com/v2/book';
    /**
     * 用书的ISBN号码获得书的信息
     * @param bookISBN 书的ISBN号码
     * @param fields 要返回的字段
     * @param callback 如果找到了对应的书就返回JSON书信息,否则返回null
     */
    this.getBookByISBD = function (bookISBN, callback, fields) {
        var url = baseUri + '/isbn/' + bookISBN;
        if (fields == null) {//默认是获取所有的字段
            fields = 'id,rating,author,pubdate,image,binding,translator,catalog,pages,publisher,isbn13,title,author_intro,summary,price';
        }
        url += '?fields=' + fields;
        jsonp(url, function (json) {
            callback(json);
        }, function () {//没有找到对于的书的信息
            if (bookISBN.length == 13) {
                that.getBookByISBD(correctISBN13(bookISBN), function (json) {
                    callback(json);
                }, fields);
            } else {
                callback(null);
            }
        });
    };
    /**
     * 只要部分必要的字段
     * @param bookISBN
     * @param callback
     */
    this.getBookByISBD_simple = function (bookISBN, callback) {
        that.getBookByISBD(bookISBN, callback, 'author,pubdate,image,publisher,title,price,isbn13');
    };
    /**
     * 搜索图书
     * @param keyword 查询关键字 keyword和tag必传其一
     * @param start 取结果的offset 默认为0
     * @param count 取结果的条数 默认为20，最大为100
     * @param callback [json]
     */
    this.searchBooks = function (keyword, start, count, callback) {
        var url = baseUri + '/search';
        if (keyword && keyword.length < 1) {
            return [];
        }
        url += '?q=' + keyword;
        if (start) {
            url += '&start=' + start;
        }
        if (count) {
            url += '&count=' + count;
        }
        url += '&fields=isbn13,title,image,author,publisher,pubdate,price';
        jsonp(url, function (json) {
            callback(json);
        });
    };

    /**
     * 获得分类对应的图书
     * @param tag 一个类别图书
     * @param start 取结果的offset 默认为0
     * @param count 取结果的条数 默认为20，最大为100
     * @param callback
     * @returns [json]
     */
    this.getBooksByTag = function (tag, start, count, callback) {
        var url = baseUri + '/search';
        if (!tag || tag.length < 1) {
            return [];
        }
        url += '?tag=' + tag;
        if (start) {
            url += '&start=' + start;
        }
        if (count) {
            url += '&count=' + count;
        }
        url += '&fields=isbn13,title,image,author,publisher,pubdate,price';
        jsonp(url, function (json) {
            callback(json);
        });
    };

    this.BookReview = {
        reviewList: [],
        nowBookId: null,
        hasMoreFlag: true,
        loadMore: function () {
            AV.Cloud.run('getDoubanBookReview', {
                id: that.BookReview.nowBookId,
                start: that.BookReview.reviewList.length
            }, null).done(function (json) {
                if (json.length > 0) {
                    for (var i = 0; i < json.length; i++) {
                        that.BookReview.reviewList.push(json[i]);
                    }
                } else {
                    that.BookReview.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMore: function () {
            return that.BookReview.hasMoreFlag;
        },
        /**
         * 清空当前数据
         */
        clear: function () {
            that.BookReview.reviewList = [];
            that.BookReview.hasMoreFlag = true;
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
        }
    };

    /**
     * 修正有问题的ISBN13错误的号码
     * @param isbn13
     * @return String 正确的10为的ISBN
     */
    function correctISBN13(isbn13) {
        var isbn9 = isbn13.substring(3, 12);
        var s = 0;
        for (var i = 0; i < 9; i++) {
            var num = parseInt(isbn9.charAt(i));
            s += num * (10 - i);
        }
        var m = s % 11;
        var n = 11 - m;
        var check = String(n);
        if (n == 10) {
            check = 'X';
        } else if (n == 11) {
            check = '0';
        }
        return String(isbn9 + check);
    }
})

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
            return that.books.length < that.totalNum;
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
                    if (that.totalNum > 0) {
                        var booksJSON = json['books'];
                        for (var i = 0; i < booksJSON.length; i++) {
                            that.books.push(booksJSON[i]);
                        }
                        $rootScope.$apply();
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        alert('没有找到你想要的图书');
                    }
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

/**
 * 图书推荐
 */
    .service('BookRecommend$', function ($rootScope, DoubanBook$, User$, UsedBook$) {
        var that = this;
        this.LoadCount = Math.floor(document.body.clientWidth / 80);//每次加载条数,默认加载慢屏幕
        this.RandomStart = (new Date().getDay()) * Math.floor(Math.random() * 10);//随机产生一个开始数,每次打开看到的专业推荐都不一样

        /**
         * 所有图书分类
         * @type {Array}
         */
        this.BookTag = {
            tag: null,
            load: function () {
                AV.Cloud.run('getAllBookTags', null, null).done(function (tag) {
                    that.BookTag.tag = tag;
                    $rootScope.$apply();
                });
            },
            getTagAttrNames: function () {
                if (that['BookTag']['tag']) {
                    return Object.keys(that['BookTag']['tag']);
                }
                return [];
            }
        };
        this['BookTag'].load();

        /**
         * 分类浏览
         * @type {{books: Array, loadMore: Function}}
         */
        this.TagBook = {
            /**
             * 当前搜索的图书分类
             */
            nowTag: '',
            setTag: function (tag) {
                if (tag != that.TagBook.nowTag) {
                    that.TagBook.books = [];
                    that.TagBook.nowTag = tag;
                }
            },
            books: [],
            hasMoreFlag: true,
            loadMore: function () {
                DoubanBook$.getBooksByTag(that.TagBook.nowTag, that.TagBook.books.length, that.LoadCount, function (json) {
                    var booksJSON = json['books'];
                    if (booksJSON.length > 0) {
                        for (var i = 0; i < booksJSON.length; i++) {
                            that.TagBook.books.push(booksJSON[i]);
                        }
                    } else {
                        that.TagBook.hasMoreTag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.TagBook.hasMoreFlag;
            }
        };

        /**
         * 专业相关图书
         * @type {{books: Array, loadMore: Function}}
         */
        this.MajorBook = {
            major: User$.getCurrentJsonUser() ? User$.getCurrentJsonUser().major : '',
            books: [],
            hasMoreFlag: true,
            loadMore: function () {
                DoubanBook$.getBooksByTag(that.MajorBook.major, that.MajorBook.books.length + that.RandomStart, that.LoadCount, function (json) {
                    that.MajorBook.totalNum = json['total'];
                    var booksJSON = json['books'];
                    if (booksJSON.length > 0) {
                        for (var i = 0; i < booksJSON.length; i++) {
                            that.MajorBook.books.push(booksJSON[i]);
                        }
                    } else {
                        that.MajorBook.hasMoreFlag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.MajorBook.hasMoreFlag;
            }
        };

        /**
         * 附近同学发布的求书
         * @type {{books: Array, loadMore: Function}}
         */
        this.NearNeedBook = {
            jsonBooks: [],
            hasMoreFlag: true,
            loadMore: function () {
                var avosGeo = User$.getCurrentUserLocation();
                var query = new AV.Query('UsedBook');
                query.equalTo('role', 'need');
                if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                    query.near("location", avosGeo);
                }
                query.skip(that.NearNeedBook.jsonBooks.length);
                query.limit(that.LoadCount);
                query.find().done(function (avosUsedBooks) {
                    if (avosUsedBooks.length > 0) {
                        for (var i = 0; i < avosUsedBooks.length; i++) {
                            that.NearNeedBook.jsonBooks.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                        }
                    } else {
                        that.NearNeedBook.hasMoreFlag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.NearNeedBook.hasMoreFlag;
            }
        };

        /**
         * 附近的二手图书
         * @type {{books: Array, loadMore: Function, hasMore: Function}}
         */
        this.NearUsedBook = {
            jsonBooks: [],
            hasMoreFlag: true,
            loadMore: function () {
                var avosGeo = User$.getCurrentUserLocation();
                var query = new AV.Query('UsedBook');
                query.equalTo('role', 'sell');
                if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                    query.near("location", avosGeo);
                }
                query.skip(that.NearUsedBook.jsonBooks.length);
                query.limit(that.LoadCount);
                query.find().done(function (avosUsedBooks) {
                    if (avosUsedBooks.length > 0) {
                        for (var i = 0; i < avosUsedBooks.length; i++) {
                            that.NearUsedBook.jsonBooks.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                        }
                    } else {
                        that.NearUsedBook.hasMoreFlag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.NearUsedBook.hasMoreFlag;
            }
        };

        /**
         * 我附近的用户
         * @type {{jsonUsers: Array, loadMore: Function, hasMore: Function}}
         */
        this.NearUser = {
            jsonUsers: [],
            hasMoreFlag: true,
            loadMore: function () {
                var avosGeo = User$.getCurrentUserLocation();
                var query = new AV.Query(AV.User);
                if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                    query.near("location", avosGeo);
                }
                query.skip(that.NearUser.jsonUsers.length);
                query.limit(Math.floor(document.body.clientWidth / 50));//默认加载满屏幕
                query.find().done(function (avosUsers) {
                    if (avosUsers.length > 0) {
                        for (var i = 0; i < avosUsers.length; i++) {
                            that.NearUser.jsonUsers.push(avosUserToJson(avosUsers[i]));
                        }
                    } else {
                        that.NearUser.hasMoreFlag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.NearUser.hasMoreFlag;
            }
        };
        this.NearUser.loadMore();
    })

    .service('BusinessSite$', function () {
        /**
         * 获得对应的ISBN号码的图书在各大电商平台的价格信息
         * @param doubanId 图书的豆瓣ID
         * @return {AV.Promise}
         */
        this.getBusinessInfoByISBN = function (doubanId) {
            return AV.Cloud.run('getBusinessInfo', {
                id: doubanId
            }, null);
        }
    })

    .service('WeChatJS$', function ($rootScope) {
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
         * @param nextState 验证完成后要去的状态
         */
        this.getOAuthURL = function (nextState) {
            var redirectUrl = location.href.split('#')[0] + '#tab/signUp';
            return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WECHAT.AppID + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=' + nextState + '#wechat_redirect';
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
                onError(err);
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

    })

    .service('InfoService$', function ($rootScope, $http, User$) {
        var that = this;
        /**
         * 所有的专业
         * @type {Array}
         */
        this.majors = [];
        //加载所有专业信息
        AV.Cloud.run('getAllMajor', null, null).done(function (majors) {
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

        this.School = {
            /**
             * 所有的加载了的学校
             * @type {Array}
             */
            schools: [],
            loadMore: function () {
                var avosGeo = User$.getCurrentUserLocation();
                var query = new AV.Query('School');
                if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                    query.near("location", avosGeo);
                }
                if (that.School.searchSchoolKeyword.length > 0) {
                    query.startsWith("name", that.School.searchSchoolKeyword);
                } else {
                    query.skip(that.School.schools.length);
                    query.limit(10);
                }
                query.find().done(function (avosSchools) {
                    if (avosSchools.length > 0) {
                        for (var i = 0; i < avosSchools.length; i++) {
                            that.School.schools.push(avosSchools[i].get('name'));
                        }
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            /**
             * 搜索学校时的关键字
             * @type {string}
             */
            searchSchoolKeyword: '',
            /**
             * 搜索专业时的过滤器
             * @param schoolName 当前学校
             * @returns {boolean} 是否合格
             */
            filter_schoolByKeyword: function (schoolName) {
                return schoolName.indexOf(that['School']['searchSchoolKeyword']) >= 0;
            }
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

    .service('IonicModalView$', function ($rootScope, $ionicModal, $ionicHistory, InfoService$) {

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

    })

    .service('User$', function ($rootScope, Status$) {
        var that = this;

        /**
         * 用户注册 用户名=Email
         * @param jsonUser json格式的用户信息
         * @returns {*|AV.Promise}
         */
        this.signUpWithJSONUser = function (jsonUser) {
            var user = jsonToAvosUser(jsonUser);
            user.set('username', jsonUser.unionId);
            user.set('password', jsonUser.unionId);
            return user.signUp(null);
        };

        /**
         * 获得当前用户的地理位置
         * 如果没有用户或用户没有位置就返回null
         */
        this.getCurrentUserLocation = function () {
            var user = that.getCurrentAvosUser();
            if (user) {
                return user.get('location');
            }
            return null;
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
                return avosUserToJson(avosUser);
            }
            return null;
        };

        /**
         * 我关注一个用户
         * @param userObjectId 用户的AVOS ID
         */
        this.followUser = function (userObjectId) {
            var me = that.getCurrentAvosUser();
            if (me) {
                me.follow(userObjectId).done(function () {
                    $rootScope.$broadcast('FollowSomeone');
                }).fail(function (err) {
                    alert('关注失败:' + err.message);
                })
            } else {
                alert('请先登入');
            }
        };

        /**
         * 我取消关注一个用户
         * @param userObjectId 用户的AVOS ID
         */
        this.unfollowUser = function (userObjectId) {
            var me = that.getCurrentAvosUser();
            if (me) {
                me.unfollow(userObjectId).done(function () {
                    $rootScope.$broadcast('UnfollowSomeone');
                }).fail(function (err) {
                    alert('取消关注失败:' + err.message);
                })
            } else {
                alert('请先登入');
            }
        };

        this.Followee = {
            jsonUserList: [],
            loadMore: function () {
                var query = AV.User.current().followeeQuery();
                query.include('followee');
                query.skip(that.Followee.jsonUserList.length);
                query.limit(10);
                query.find().done(function (followees) {
                    if (followees.length > 0) {
                        for (var i = 0; i < followees.length; i++) {
                            that.Followee.jsonUserList.push(avosUserToJson(followees[i]));
                        }
                    } else {
                        that.Followee.hasMoreFlag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            },
            hasMoreFlag: true,
            hasMore: function () {
                return that.Followee.hasMoreFlag;
            }
        };

        this.Follower = {
            jsonUserList: [],
            loadMore: function () {
                var query = AV.User.current().followerQuery();
                query.include('follower');
                query.skip(that.Follower.jsonUserList.length);
                query.limit(10);
                query.find().done(function (followers) {
                    if (followers.length > 0) {
                        for (var i = 0; i < followers.length; i++) {
                            that.Follower.jsonUserList.push(avosUserToJson(followers[i]));
                        }
                    } else {
                        that.Follower.hasMoreFlag = false;
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            },
            hasMoreFlag: true,
            hasMore: function () {
                return that.Follower.hasMoreFlag;
            }
        };

        /**
         * 替换微信默认的头像的大小
         * @param avatarUrl 头像的url
         * @param size 替换后获得的大小 有0、46、64、96、132数值可选，0代表640*640正方形头像
         * @returns {string} 替换后头像的url
         */
        this.changeWechatAvatarSize = function (avatarUrl, size) {
            if (avatarUrl) {
                return avatarUrl.substring(0, avatarUrl.length - 1) + size;
            } else {
                return null;
            }
        };

        /**
         * 使用微信写在cookie里的unionId登入,
         * 登陆成功后回加载未读消息数量
         * @param unionId 微信ID
         * @returns {*|AV.Promise}
         */
        this.loginWithUnionId = function (unionId) {
            var rePromise = new AV.Promise(null);
            if (unionId) {
                AV.User.logIn(unionId, unionId).done(function (me) {
                    rePromise.resolve(me);
                    Status$.loadUnreadStatusesCount();//加载未读消息数量
                }).fail(function (err) {
                    rePromise.reject(err);
                })
            } else {
                rePromise.reject('unionId错误');
            }
            return rePromise;
        };
    })

    .service('UsedBook$', function ($rootScope) {
        var that = this;
        var UsedBookAttrNames = ['owner', 'isbn13', 'price', 'des', 'image', 'title', 'role'];

        /**
         * 是否正在加载数据
         * @type {boolean}
         */
        this.isLoading = false;

        /**
         * 加载对应用户所有还没有卖出的二手书
         * @param avosUser
         * @returns {*|AV.Promise}
         */
        this.loadUsedBookListForOwner = function (avosUser) {
            var query = avosUser.relation('usedBooks').query();
            query.equalTo('role', 'sell');
            return query.find();
        };

        /**
         * 加载对应用户所有发布的求书
         * @param avosUser
         * @returns {*|AV.Promise}
         */
        this.loadNeedBookListForOwner = function (avosUser) {
            var query = avosUser.relation('usedBooks').query();
            query.equalTo('role', 'need');
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
            var query = AV.User.current().relation('usedBooks').query();
            query.equalTo('role', 'sell');
            query.descending('updatedAt');
            query.find().done(function (avosUsedBooks) {
                that.myAvosUsedBookList = avosUsedBooks;
            }).always(function () {
                that.isLoading = false;
                $rootScope.$apply();
            });
        };

        /**
         * 所有我发布的求书列表
         * @type {Array}
         */
        this.myAvosNeedBookList = [];
        /**
         * 加载所有我上传的二手书
         */
        this.loadMyAvosNeedBookList = function () {
            that.isLoading = true;
            var query = AV.User.current().relation('usedBooks').query();
            query.equalTo('role', 'need');
            query.descending('updatedAt');
            query.find().done(function (avosUsedBooks) {
                that.myAvosNeedBookList = avosUsedBooks;
            }).always(function () {
                that.isLoading = false;
                $rootScope.$apply();
            });
        };

        /**
         * 删除一本没有卖出的二手书
         * @param avosUsedBook
         */
        this.removeUsedBook = function (avosUsedBook) {
            var role = avosUsedBook.get('role');
            if (window.confirm('你确定要删除它吗?将不可恢复')) {
                avosUsedBook.destroy().done(function () {
                    if (role == 'sell') {
                        that.loadMyAvosUsedBookList();
                    } else if (role == 'need') {
                        that.loadMyAvosNeedBookList();
                    }
                }).fail(function (error) {
                    alert(error.message);
                })
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
            var UsedBook = AV.Object.extend("UsedBook");
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

        this.ISBN_sell = {
            /**
             * 获得对应ISBN的二手书一共有多少本
             * @param isbn13
             * @returns {*|AV.Promise}
             */
            getUsedBookNumberEqualISBN: function (isbn13) {
                var query = new AV.Query('UsedBook');
                query.equalTo('role', 'sell');
                query.equalTo("isbn13", isbn13);
                return query.count();
            },
            /**
             * 目前正在加载的二手书的ISBN号码
             * @type {string}
             */
            nowISBN13: '',
            /**
             * 目前已经加载了对应的ISBN号码的二手书列表
             * @type {Array}
             */
            nowEqualISBNJsonUsedBookList: [],
            /**
             * 获得所有对应ISBN的二手书
             * @param isbn13
             */
            loadMoreUsedBookEqualISBN: function (isbn13) {
                that.isLoading = true;
                if (isbn13 != that.ISBN_sell.nowISBN13) {//如果是新的ISBN号码就清空以前的
                    that.ISBN_sell.nowISBN13 = isbn13;
                    that.ISBN_sell.nowEqualISBNJsonUsedBookList = [];
                    that.ISBN_sell.hasMoreFlag = true;
                }
                var query = new AV.Query('UsedBook');
                query.equalTo("isbn13", that.ISBN_sell.nowISBN13);
                query.equalTo('role', 'sell');
                query.descending("updatedAt");
                query.skip(that.ISBN_sell.nowEqualISBNJsonUsedBookList.length);
                query.limit(5);
                query.include('owner');
                query.find().done(function (avosUsedBooks) {
                    if (avosUsedBooks.length > 0) {
                        for (var i = 0; i < avosUsedBooks.length; i++) {
                            that.ISBN_sell.nowEqualISBNJsonUsedBookList.push(that.avosUsedBookToJson(avosUsedBooks[i]));
                        }
                    } else {
                        that.ISBN_sell.hasMoreFlag = false;
                    }
                }).always(function () {
                    that.isLoading = false;
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMoreFlag: true,
            hasMore: function () {
                return that.ISBN_sell.hasMoreFlag;
            }
        };

        this.ISBN_need = {
            /**
             * 获得对应ISBN的二手书一共有多少本
             * @param isbn13
             * @returns {*|AV.Promise}
             */
            getNeedBookNumberEqualISBN: function (isbn13) {
                var query = new AV.Query('UsedBook');
                query.equalTo('role', 'need');
                query.equalTo("isbn13", isbn13);
                return query.count();
            },
            /**
             * 目前正在加载的二手书的ISBN号码
             * @type {string}
             */
            nowISBN13: '',
            /**
             * 目前已经加载了对应的ISBN号码的二手书列表
             * @type {Array}
             */
            nowEqualISBNJsonNeedBookList: [],
            /**
             * 获得所有对应ISBN的二手书
             * @param isbn13
             */
            loadMoreNeedBookEqualISBN: function (isbn13) {
                that.isLoading = true;
                if (isbn13 != that.ISBN_need.nowISBN13) {//如果是新的ISBN号码就清空以前的
                    that.ISBN_need.nowISBN13 = isbn13;
                    that.ISBN_need.nowEqualISBNJsonNeedBookList = [];
                    that.ISBN_need.hasMoreFlag = true;
                }
                var query = new AV.Query('UsedBook');
                query.equalTo("isbn13", that.ISBN_need.nowISBN13);
                query.equalTo('role', 'need');
                query.descending("updatedAt");
                query.skip(that.ISBN_need.nowEqualISBNJsonNeedBookList.length);
                query.limit(5);
                query.include('owner');
                query.find().done(function (avosUsedBooks) {
                    if (avosUsedBooks.length > 0) {
                        for (var i = 0; i < avosUsedBooks.length; i++) {
                            that.ISBN_need.nowEqualISBNJsonNeedBookList.push(that.avosUsedBookToJson(avosUsedBooks[i]));
                        }
                    } else {
                        that.ISBN_need.hasMoreFlag = false;
                    }
                }).always(function () {
                    that.isLoading = false;
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMoreFlag: true,
            hasMore: function () {
                return that.ISBN_need.hasMoreFlag;
            }
        };
    })

    .service('Status$', function ($rootScope, UsedBook$) {
        var that = this;
        var AttrName = ['inboxType', 'message', 'source', 'to', 'usedBook'];

        /**
         * 加载我未读的消息的数量,并且显示在Tab上
         */
        this.loadUnreadStatusesCount = function () {
            var user = AV.User.current();
            if (user) {
                AV.Status.countUnreadStatuses(user, 'newUsedBook').done(function (result) {
                    that.NewUsedBookStatus.unreadCount = result['unread'];
                    $rootScope.$apply();
                });
                AV.Status.countUnreadStatuses(user, 'newNeedBook').done(function (result) {
                    that.NewNeedBookStatus.unreadCount = result['unread'];
                    $rootScope.$apply();
                });
            }
        };

        this.NewUsedBookStatus = {
            unreadCount: 0,
            avosStatusList: [],
            loadMore: function () {
                var query = AV.Status.inboxQuery(AV.User.current(), 'newUsedBook');
                query.include("usedBook");
                query.include("source");
                query.limit(that.NewUsedBookStatus.unreadCount);
                query.find().done(function (statuses) {
                    for (var i = 0; i < statuses.length; i++) {
                        var one = statuses[i];
                        one.jsonUserInfo = avosUserToJson(one.get('source'));
                        one.jsonUsedBook = UsedBook$.avosUsedBookToJson(one.get('usedBook'));
                        that.NewUsedBookStatus.avosStatusList.push(one);
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            }
        };

        this.NewNeedBookStatus = {
            unreadCount: 0,
            avosStatusList: [],
            loadMore: function () {
                var query = AV.Status.inboxQuery(AV.User.current(), 'newNeedBook');
                query.include("usedBook");
                query.include("source");
                query.limit(that.NewNeedBookStatus.unreadCount);
                query.find().done(function (statuses) {
                    for (var i = 0; i < statuses.length; i++) {
                        var one = statuses[i];
                        one.jsonUserInfo = avosUserToJson(one.get('source'));
                        one.jsonUsedBook = UsedBook$.avosUsedBookToJson(one.get('usedBook'));
                        that.NewNeedBookStatus.avosStatusList.push(one);
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            }
        };

        this.avosStatusToJson = function (avosStatus) {
            var re = {};
            for (var i = 0; i < AttrName.length; i++) {
                re[AttrName[i]] = avosStatus.get(AttrName[i]);
            }
            re.updatedAt = avosStatus.get('updatedAt');
            re.objectId = avosStatus.id;
            return re;
        };

        /**
         * 我发送私信给用户
         * @param receiverObjectId 接受者的avos id
         * @param msg 消息内容
         * @param role 我当前扮演的角色是卖家(=sell)还是买家(=buy)
         * @param usedBookObjectId 当前二手书的AVOS ID(可为空)
         * @returns {AV.Promise}
         */
        this.sendPrivateMsg = function (receiverObjectId, msg, role, usedBookObjectId) {
            var status = new AV.Status(null, msg);
            status.set('to', AV.Object.createWithoutData('_User', receiverObjectId));
            usedBookObjectId && status.set('usedBook', AV.Object.createWithoutData('UsedBook', usedBookObjectId));
            status.set('role', role);
            return AV.Status.sendPrivateStatus(status, receiverObjectId);
        };

        /**
         * 对一本二手书进行评论,评论的内容会被所有人看到
         * @param receiverObjectId 微信通知消息接受者的AVOS Id
         * @param usedBookObjectId 二手书的AVOS id
         * @param msg 评论内容
         * @param role 我当前扮演的角色是卖家(=sell)还是买家(=buy)
         * @returns {AV.Promise}
         */
        this.reviewUsedBook = function (receiverObjectId, usedBookObjectId, msg, role) {
            var rePromise = new AV.Promise(null);
            var query = new AV.Query('UsedBook');
            query.select('owner');
            query.get(usedBookObjectId).done(function (avosUsedBook) {
                var bookOwner = avosUsedBook.get('owner');
                query = new AV.Query(AV.User);
                query.equalTo('objectId', bookOwner.id);
                var status = new AV.Status(null, msg);
                status.query = query;
                status.inboxType = 'reviewUsedBook';
                status.set('to', AV.Object.createWithoutData('_User', receiverObjectId));
                status.set('role', role);
                status.set('usedBook', avosUsedBook);
                status.send().done(function (status) {
                    rePromise.resolve(status);
                }).fail(function (err) {
                    rePromise.reject(err);
                })
            }).fail(function (err) {
                rePromise.reject(err);
            });
            return rePromise;
        };

        /**
         * 获得关于一本书的所有评价
         * @param usedBookId
         * @returns {*|{}|AV.Promise}
         */
        this.getStatusList_reviewBook = function (usedBookId) {
            var query = new AV.Query('_Status');
            var usedBook = AV.Object.createWithoutData('UsedBook', usedBookId);
            query.equalTo('inboxType', 'reviewUsedBook');
            query.equalTo('usedBook', usedBook);
            return query.find();
        };

        /**
         * 获得所有关于我和另一个用户之间的消息
         * @param avosUserId 对方用户的id
         * @param avosUsedBookId 二手书的id 两个有这个参数就只显示关于这部二手书的私信,否则显示所有的私信
         * @returns {*|{}|AV.Promise}
         */
        this.getStatusList_twoUser = function (avosUserId, avosUsedBookId) {
            var me = AV.User.current();
            var he = AV.Object.createWithoutData('_User', avosUserId);
            var query1 = new AV.Query('_Status');
            query1.equalTo('source', me);
            query1.equalTo('to', he);
            var query2 = new AV.Query('_Status');
            query2.equalTo('source', he);
            query2.equalTo('to', me);
            if (avosUsedBookId) {
                var avosUsedBook = AV.Object.createWithoutData('UsedBook', avosUsedBookId);
                query1.equalTo('usedBook', avosUsedBook);
                query2.equalTo('usedBook', avosUsedBook);
            }
            var mainQuery = AV.Query.or(query1, query2);
            return mainQuery.find();
        }
    })

    .service('LatestBook$', function ($rootScope, BookRecommend$) {
        var AttrName = ['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price'];
        var that = this;

        this.avosLatestBookToJson = function (avosBook) {
            var re = {};
            for (var i = 0; i < AttrName.length; i++) {
                var attr = AttrName[i];
                re[attr] = avosBook.get(attr);
            }
            re.updatedAt = avosBook.updatedAt;
            re.objectId = avosBook.id;
            return re;
        };

        this.jsonBooks = [];
        this.hasMoreFlag = true;
        this.loadMore = function () {
            var query = new AV.Query('LatestBook');
            query.descending('pubdate');
            query.skip(that.jsonBooks.length + BookRecommend$.RandomStart);
            query.limit(BookRecommend$.LoadCount);
            query.find().done(function (avosLatestBookList) {
                if (avosLatestBookList.length > 0) {
                    for (var i = 0; i < avosLatestBookList.length; i++) {
                        that.jsonBooks.push(that.avosLatestBookToJson(avosLatestBookList[i]));
                    }
                } else {
                    that.hasMoreFlag = false;
                }
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        this.hasMore = function () {
            return that.hasMoreFlag;
        }
    });