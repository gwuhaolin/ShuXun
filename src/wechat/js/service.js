/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
/**
 * 豆瓣图书接口
 */
APP.service('DoubanBook$', function () {
    var that = this;
    var baseUri = 'http://api.douban.com/v2/book';
    /**
     * 用书的ISBN号码获得书的信息
     * @param bookISBN 书的ISBN号码
     * @param fields 要返回的字段
     * @param callback
     */
    this.getBookByISBD = function (bookISBN, callback, fields) {
        var url = baseUri + '/isbn/' + bookISBN;
        if (fields == null) {//默认是获取所有的字段
            fields = 'id,rating,author,pubdate,image,binding,translator,catalog,pages,publisher,isbn13,title,author_intro,summary,price';
        }
        url += '?fields=' + fields;
        jsonp(url, callback);
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

/**
 * 图书推荐
 */
    .service('BookRecommend$', function ($rootScope, DoubanBook$, User$, UsedBook$) {
        var that = this;

        /**
         * 所有图书分类
         * @type {Array}
         */
        this.BookTag = {
            tag: null,
            load: function () {
                jsonp('/info/getAllBookTags', function (tag) {
                    that.BookTag.tag = tag;
                    $rootScope.$apply();
                })
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
            /**
             * 该关键字一共检索到的书的数量
             */
            totalNum: 0,
            setTag: function (tag) {
                if (tag != that.TagBook.nowTag) {
                    that.TagBook.books = [];
                    that.TagBook.nowTag = tag;
                }
            },
            books: [],
            loadMore: function () {
                DoubanBook$.getBooksByTag(that.TagBook.nowTag, that.TagBook.books.length, 5, function (json) {
                    that.TagBook.totalNum = json['total'];
                    var booksJSON = json['books'];
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.TagBook.books.push(booksJSON[i]);
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.TagBook.books.length < that.TagBook.totalNum;
            }
        };

        /**
         * 专业相关图书
         * @type {{books: Array, loadMore: Function}}
         */
        this.MajorBook = {
            major: User$.getCurrentJsonUser() ? User$.getCurrentJsonUser().major : '',
            books: [],
            loadMore: function () {
                DoubanBook$.getBooksByTag(that.MajorBook.major, that.MajorBook.books.length, 5, function (json) {
                    that.MajorBook.totalNum = json['total'];
                    var booksJSON = json['books'];
                    for (var i = 0; i < booksJSON.length; i++) {
                        that.MajorBook.books.push(booksJSON[i]);
                    }
                    $rootScope.$apply();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                })
            },
            hasMore: function () {
                return that.MajorBook.books.length < that.MajorBook.totalNum;
            }
        };

        /**
         * TODO 待实现
         * 你可能需要的图书
         * @type {{books: Array, loadMore: Function}}
         */
        this.NeedBook = {
            books: [],
            loadMore: function () {

            }
        };

        /**
         * 附近的二手图书
         * @type {{books: Array, loadMore: Function, hasMore: Function}}
         */
        this.NearBook = {
            jsonBooks: [],
            loadMore: function () {
                var avosGeo = User$.getCurrentUserLocation();
                var query = new AV.Query('UsedBook');
                if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                    query.near("location", avosGeo);
                }
                query.skip(that.NearBook.jsonBooks.length);
                query.limit(5);
                query.find().done(function (avosUsedBooks) {
                    if (avosUsedBooks.length > 0) {
                        for (var i = 0; i < avosUsedBooks.length; i++) {
                            that.NearBook.jsonBooks.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                        }
                    }
                    $rootScope.$apply();
                })
            }
        };

        /**
         * 我附近的用户
         * @type {{jsonUsers: Array, loadMore: Function, hasMore: Function}}
         */
        this.NearUser = {
            jsonUsers: [],
            loadMore: function () {
                var avosGeo = User$.getCurrentUserLocation();
                var query = new AV.Query(AV.User);
                if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                    query.near("location", avosGeo);
                }
                query.skip(that.NearUser.jsonUsers.length);
                query.limit(5);
                query.find().done(function (avosUsers) {
                    if (avosUsers.length > 0) {
                        for (var i = 0; i < avosUsers.length; i++) {
                            that.NearUser.jsonUsers.push(User$.avosUserToJson(avosUsers[i]));
                        }
                    }
                    $rootScope.$apply();
                })
            }
        };
        this.NearUser.loadMore();
    })

    .service('BusinessSite$', function ($http) {
        /**
         * 获得对应的ISBN号码的图书在各大电商平台的价格信息
         * @param doubanId 图书的豆瓣ID
         * @param callback 返回图书的电商信息
         */
        this.getBusinessInfoByISBN = function (doubanId, callback) {
            $http.jsonp('/business/' + doubanId + '?callback=JSON_CALLBACK').success(function (json) {
                callback(json);
            });
        }
    })

    .service('WeChatJS$', function ($rootScope) {
        //先配置好微信
        jsonp('/wechat/getJsConfig', function (json) {
            wx.config(json);
        });

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
         * @param state 验证完成后要去的状态
         */
        this.getOAuthURL = function (state) {
            var redirectUrl = location.href.split('#')[0] + '#tab/signUp';
            return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WECHAT.AppID + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
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
                    unionId: wechatInfo['unionid'],
                    nickName: wechatInfo['nickname'],
                    sex: wechatInfo['sex'],
                    avatarUrl: wechatInfo['headimgurl']
                };
                createCookie('unionId', re.unionId, 365);
                callback(re);
            })
        };

        /**
         * 调用微信接口显示地图
         * @param lat
         * @param lon
         */
        this.openMap = function (lat, lon) {
            wx.openLocation({
                latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                longitude: lon, // 经度，浮点数，范围为180 ~ -180。
                name: '该同学位置' // 位置名
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

    .service('User$', function ($http) {
        var that = this;

        /**
         * 一个用户所有具有的属性名称
         * @type {string[]}
         */
        var UserAttrNames = ['openId', 'nickName', 'avatarUrl', 'sex', 'school', 'major', 'startSchoolYear'];

        /**
         * 用户注册 用户名=Email
         * @param jsonUser json格式的用户信息
         * @returns {*|AV.Promise}
         */
        this.signUpWithJSONUser = function (jsonUser) {
            var user = that.jsonToAvosUser(jsonUser);
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
            json.location = avosUser.get('location');
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

        /***
         * 获得微信openId的用户
         * @param openId
         * @returns {*|AV.Promise|{value, color}}
         */
        this.getAvosUserByOpenId = function (openId) {
            var query = new AV.Query(AV.User);
            query.equalTo('openId', openId);
            return query.first();
        };

        /***
         * 获得微信openId的用户
         * @param unionId
         * @returns {*|AV.Promise|{value, color}}
         */
        this.getAvosUserByUnionId = function (unionId) {
            var query = new AV.Query(AV.User);
            query.equalTo('username', unionId);
            return query.first();
        };


        /**
         * 我发送消息给其他用户
         * @param receiverId 接收者的openID
         * @param msg 消息内容
         * @param onSuccess 发送成功就返回msgid
         * @param onError 返回错误
         */
        this.sendMsgToUser = function (receiverId, msg, onSuccess, onError) {
            var myJsonInfo = that.getCurrentJsonUser();
            var sendName = myJsonInfo.nickName;
            var sendId = myJsonInfo.openId;
            $http.jsonp('/wechat/sendMsgTo?callback=JSON_CALLBACK', {
                params: {
                    sendName: sendName,
                    sendId: sendId,
                    receiverId: receiverId,
                    msg: msg
                }
            }).success(function (result) {
                if (result['errcode'] == 0) {
                    onSuccess(result['msgid'])
                } else {
                    onError(result);
                }
            }).error(function (error) {
                onError(error);
            })
        };
    })

    //还没有卖出的二手书
    .service('UsedBook$', function ($rootScope, HasSellUsedBook$) {
        var that = this;
        var UsedBookAttrNames = ['owner', 'isbn13', 'price', 'des', 'image', 'title'];

        /**
         * 是否正在加载数据
         * @type {boolean}
         */
        this.isLoading = false;

        /**
         * 获得这位主人还没有卖出的二手书的数量
         * @param avosUserObjectId
         * @returns {*|AV.Promise}
         */
        this.getUsedBookNumberForOwner = function (avosUserObjectId) {
            var query = new AV.Query('UsedBook');
            var avosUser = new AV.User();
            avosUser.id = avosUserObjectId;
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

        this.ISBN = {
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
                if (isbn13 != that.ISBN.nowISBN13) {//如果是新的ISBN号码就清空以前的
                    that.ISBN.nowISBN13 = isbn13;
                    that.ISBN.nowEqualISBNJsonUsedBookList = [];
                }
                var query = new AV.Query('UsedBook');
                query.equalTo("isbn13", that.ISBN.nowISBN13);
                query.descending("updatedAt");
                query.skip(that.ISBN.nowEqualISBNJsonUsedBookList.length);
                query.limit(5);
                query.find().done(function (avosUsedBooks) {
                    if (avosUsedBooks.length > 0) {
                        for (var i = 0; i < avosUsedBooks.length; i++) {
                            that.ISBN.nowEqualISBNJsonUsedBookList.push(that.avosUsedBookToJson(avosUsedBooks[i]));
                        }
                    }
                }).always(function () {
                    that.isLoading = false;
                    $rootScope.$apply();
                })
            }
        };
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