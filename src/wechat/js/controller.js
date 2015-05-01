/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
//图书推荐
APP.controller('tabs', function ($scope, User$) {
    $scope.User$ = User$;
})
    .controller('book_recommend', function ($scope, $ionicModal, BookRecommend$, User$) {
        $scope.User$ = User$;
        $scope.BookRecommend$ = BookRecommend$;
        BookRecommend$.MajorBook.loadMore();
        BookRecommend$.NeedBook.loadMore();
        BookRecommend$.NearBook.loadMore();
        $ionicModal.fromTemplateUrl('template/bookTags.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bookTagsModalView = modal;
        });
    })

    //图书搜索
    .controller('book_searchList', function ($scope, $timeout, $state, $stateParams, SearchBook$, WeChatJS$) {
        $scope.SearchBook$ = SearchBook$;

        var keyword = $stateParams['keyword'];
        if (keyword) {//如果url里附带keyword参数就自动执行搜索
            SearchBook$.keyword = keyword;
            SearchBook$.searchBtnOnClick();
        }

        $scope.scanQRBtnOnClick = function () {
            WeChatJS$.scanQRCode(function (code) {
                if (code && code.length >= 10 && code.length <= 13) {
                    $state.go('tab.book_oneBook', {isbn13: code});
                } else {
                    alert('不合法的ISBN号');
                }
            });
        }
    })

    //豆瓣图书列表
    .controller('book_bookList', function ($scope, $stateParams, BookRecommend$) {
        $scope.title = $stateParams['title'];
        var cmd = $stateParams['cmd'];
        if (cmd == 'tag') {
            var tag = $stateParams['tag'];
            BookRecommend$.TagBook.setTag(tag);
            BookRecommend$.TagBook.loadMore();
            $scope.title = tag;
            $scope.books = BookRecommend$.TagBook.books;
            $scope.loadMore = BookRecommend$.TagBook.loadMore;
            $scope.hasMore = BookRecommend$.TagBook.hasMore;
        } else if (cmd == 'need') {
            $scope.books = BookRecommend$.NeedBook.books;
            $scope.loadMore = BookRecommend$.NeedBook.loadMore;
            $scope.hasMore = BookRecommend$.NeedBook.hasMore;
        } else if (cmd == 'major') {
            $scope.books = BookRecommend$.MajorBook.books;
            $scope.loadMore = BookRecommend$.MajorBook.loadMore;
            $scope.title = BookRecommend$.MajorBook.major;
            $scope.hasMore = BookRecommend$.MajorBook.hasMore;
        } else if (cmd == 'new') {
            $scope.books = BookRecommend$.NewBook.books;
            $scope.loadMore = BookRecommend$.NewBook.loadMore;
            $scope.title = '新书速递';
            $scope.hasMore = BookRecommend$.NewBook.hasMore;
        }
    })

    //二手书列表
    .controller('book_usedBookList', function ($scope, $stateParams, UsedBook$, BookRecommend$) {
        var cmd = $stateParams['cmd'];
        $scope.sortWay = '';
        if (cmd == 'near') {
            $scope.title = '你附近的二手书';
            $scope.jsonUsedBooks = BookRecommend$.NearBook.jsonBooks;
            $scope.loadMore = BookRecommend$.NearBook.loadMore;
            $scope.hasMore = BookRecommend$.NearBook.hasMore;
        } else if (cmd == 'isbn') {
            $scope.title = '对应的二手书';
            var isbn13 = $stateParams['isbn13'];
            UsedBook$.ISBN.loadMoreUsedBookEqualISBN(isbn13);
            $scope.jsonUsedBooks = UsedBook$.ISBN.nowEqualISBNJsonUsedBookList;
            $scope.loadMore = UsedBook$.ISBN.loadMoreUsedBookEqualISBN(isbn13);
            $scope.hasMore = BookRecommend$.ISBN.hasMore;
        }
    })

    //展示一本书详细信息
    .controller('book_oneBook', function ($scope, $state, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$, UsedBook$, IonicModalView$, BusinessSite$) {
        //////////// 豆瓣图书信息 /////////
        $scope.isbn13 = $stateParams.isbn13;
        $scope.book = null;
        //目前是否正在加载数据
        $scope.isLoading = true;
        DoubanBook$.getBookByISBD($scope.isbn13, function (json) {
            if (json) {
                json.image = json.image.replace('mpic', 'lpic');//大图显示
                $scope.book = json;
                $scope.isbn13 = json.isbn13;
                $scope.isLoading = false;
                $scope.$apply();
                //加载电商联盟信息
                BusinessSite$.getBusinessInfoByISBN(json.id).done(function (infos) {
                    $scope.businessInfos = infos;
                });
            } else {
                alert('没有找到图书信息,再去搜搜看~');
                $state.go('tab.book_searchList');
            }
        });

        //显示作者介绍
        $scope.showAuthorIntro = function () {
            var title = $scope.book.author.toString();
            var pre = $scope.book['author_intro'];
            IonicModalView$.alertTitleAndPreModalView(title, pre);
        };
        //显示出版信息
        $scope.showPubInfo = function () {
            var title = '出版信息';
            var b = $scope.book;
            var pre = '作者:' + b.author.toString() +
                '\n出版社:' + b['publisher'] +
                '\n出版年:' + b['pubdate'] +
                '\n页数:' + b['pages'] +
                '\n定价:' + b['price'] +
                '\n装帧:' + b['binding'] +
                '\nISBN:' + b['isbn13'] +
                '\n目录:\n' + b['catalog'];
            IonicModalView$.alertTitleAndPreModalView(title, pre);
        };

        //显示图书简介
        $scope.showSummary = function () {
            var title = '图书简介';
            var pre = $scope.book.summary;
            IonicModalView$.alertTitleAndPreModalView(title, pre);
        };

        //////////// 二手书信息 /////////
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.getUsedBookNumberEqualISBN($scope.isbn13).done(function (number) {
            //对应的图书有多少本二手书
            $scope.usedBookNumber = number;
        });
        UsedBook$.ISBN.loadMoreUsedBookEqualISBN($scope.isbn13);//先加载5个

        $scope.WeChatJS$ = WeChatJS$;
    })

    .controller('book_bookReview', function ($scope, $stateParams, DoubanBook$, IonicModalView$) {
        $scope.BookReview = DoubanBook$.BookReview;
        $scope.BookReview.nowBookId = $stateParams['doubanBookId'];
        $scope.title = $stateParams['bookTitle'] + ' 书评';
        $scope.$on('$ionicView.afterLeave', function () {
            $scope.BookReview.clear();
        });
        $scope.showFull = function (title, reviewId) {
            DoubanBook$.BookReview.getOneFullReview(reviewId).done(function (pre) {
                IonicModalView$.alertTitleAndPreModalView(title, pre);
            })
        }
    })

    .controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, WeChatJS$, Chat$) {
        $scope.User$ = User$;
        $scope.WeChatJS$ = WeChatJS$;
        $scope.usedBookAvosObjectId = $stateParams['usedBookAvosObjectId'];

        //加载二手书数据
        UsedBook$.getJsonUsedBookByAvosObjectId($scope.usedBookAvosObjectId, function (json) {
            json.image = json.image ? json.image.replace('mpic', 'lpic') : '';//大图显示
            $scope.jsonUsedBook = json;
            $scope.$apply();
            var avosOwner = $scope.jsonUsedBook.owner;
            avosOwner.fetch().done(function (avosOwner) {
                $scope.ownerInfo = User$.avosUserToJson(avosOwner);
                $scope.$apply();
            });
        });

        //加载评论数据
        Chat$.getChatList_UsedBook($scope.usedBookAvosObjectId).done(function (avosChats) {
            $scope.jsonChats = [];
            for (var i = 0; i < avosChats.length; i++) {
                var jsonChat = Chat$.avosChatToJson(avosChats[i]);
                jsonChat.from.fetch().done(function () {
                    $scope.$apply();
                });
                jsonChat.to.fetch().done(function () {
                    $scope.$apply();
                });
                $scope.jsonChats.push(jsonChat);
            }
            $scope.$apply();
        })
    })

    ////////////////// person ////////////////////

    .controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicHistory, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, User$) {
        $scope.isLoading = false;
        $scope.WeChatJS$ = WeChatJS$;
        $scope.$on('$ionicView.afterEnter', function () {
            $scope.usedBookInfo = {
                isbn13: $stateParams.isbn13,
                price: null,
                des: null,
                image: '',
                title: ''
            };
            if ($scope.usedBookInfo.isbn13) {
                loadDoubanBookInfo();
            }
            $scope.usedBookInfo.owner = User$.getCurrentAvosUser();
        });

        $ionicModal.fromTemplateUrl('template/noBarCodeModalView.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.noBarCodeModalView = modal;
        });

        //用$scope.usedBookInfo.isbn13去豆瓣加载图书信息
        function loadDoubanBookInfo() {
            $scope.isLoading = true;
            DoubanBook$.getBookByISBD_simple($scope.usedBookInfo.isbn13, function (json) {
                if (json) {
                    $scope.doubanBookInfo = json;
                    $scope.usedBookInfo.isbn13 = json.isbn13;
                    $scope.isLoading = false;
                    $scope.usedBookInfo.image = json.image.replace('mpic', 'lpic');//大图显示
                    $scope.usedBookInfo.title = json.title;
                    $scope.$apply();
                } else {
                    alert('没有找到图书信息,再去搜搜看~');
                    $state.go('tab.book_searchList');
                }
            });
        }

        $scope.scanQRBtnOnClick = function () {
            WeChatJS$.scanQRCode(function (code) {
                $scope.usedBookInfo.isbn13 = code;
                loadDoubanBookInfo();
            });
        };

        $scope.submitOnClick = function () {
            $scope.isLoading = true;
            var avosUsedBook = UsedBook$.jsonUsedBookToAvos($scope.usedBookInfo);
            avosUsedBook.save(null).done(function () {
                $state.go('tab.person_usedBooksList');
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
                $scope.$apply();
            })
        }

    })

    .controller('person_editPersonInfo', function ($scope, $state, $ionicHistory, InfoService$, User$, IonicModalView$) {
        //是否对属性进行了修改
        $scope.attrHasChange = false;
        $scope.userInfo = User$.getCurrentJsonUser();

        IonicModalView$.registerChooseSchoolModalView($scope, function (school) {
            $scope.attrHasChange = true;
            $scope.userInfo['school'] = school;
        });
        IonicModalView$.registerChooseMajorModalView($scope, function (major) {
            $scope.attrHasChange = true;
            $scope.userInfo['major'] = major;
        });
        $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;

        //点击提交修改时
        $scope.submitOnClick = function () {
            var unionId = readCookie('unionId');
            loginWithUnionId(unionId).done(function (avosUser) {
                avosUser.fetchWhenSave(true);
                avosUser.save({
                    school: $scope.userInfo['school'],
                    major: $scope.userInfo['major'],
                    startSchoolYear: $scope.userInfo['startSchoolYear']
                }).done(function () {
                    alert('修改成功');
                }).fail(function (error) {
                    alert('修改失败:' + error.message);
                }).always(function () {
                    $state.go('tab.person_my');
                    $ionicHistory.clearHistory();
                })
            })
        }
    })

    .controller('person_my', function ($scope, $state, $stateParams, User$) {
        function load() {
            $scope.userInfo = User$.getCurrentJsonUser();
            //加载我上传的二手书的数量
            User$.getCurrentAvosUser().relation('usedBooks').query().count().done(function (number) {
                $scope.myUsedBookNumber = number;
                $scope.$apply();
            });
            //加载我关注的同学的数量
            var query = AV.User.current().followeeQuery();
            query.count().done(function (followeeNumber) {
                $scope.followeeNumber = followeeNumber;
                $scope.$apply();
            });
            //加载我的粉丝的数量
            query = AV.User.current().followerQuery();
            query.count().done(function (followerNumber) {
                $scope.followerNumber = followerNumber;
                $scope.$apply();
            });
        }

        $scope.$on('$ionicView.afterEnter', load);

        /**
         * 用户退出
         */
        $scope.logOut = function () {
            AV.User.logOut();
            eraseCookie('unionId');
            wx.closeWindow();
        }
    })

    .controller('person_usedBookList', function ($scope, UsedBook$) {
        //还没有卖出
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadMyAvosUsedBookList();

    })

    .controller('person_editOneUsedBook', function ($scope, $state, $ionicHistory, $stateParams, UsedBook$) {
        var indexInMyAvosUsedBook_notSell = $stateParams['indexInMyAvosUsedBook_notSell'];
        $scope.avosUsedBook = UsedBook$.myAvosUsedBookList[indexInMyAvosUsedBook_notSell];
        $scope.valueHasChange = false;
        $scope.jsonUsedBookChangeInfo = UsedBook$.avosUsedBookToJson($scope.avosUsedBook);
        $scope.submitOnClick = function () {
            $scope.avosUsedBook.set('des', $scope.jsonUsedBookChangeInfo.des);
            $scope.avosUsedBook.set('price', $scope.jsonUsedBookChangeInfo.price);
            $scope.avosUsedBook.save(null).done(function () {
                $state.go('tab.person_usedBooksList');
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            })
        }
    })

    .controller('person_sendMsgToUser', function ($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, User$, UsedBook$, Chat$) {
        var receiverId = $stateParams['openId'];
        var usedBookAvosObjectId = $stateParams['usedBookAvosObjectId'];
        $scope.isLoading = false;
        $scope.msg = {
            sendMsg: '',
            usedBookAvosObjectId: usedBookAvosObjectId,
            role: $stateParams['role'],
            isPrivate: $stateParams['isPrivate'] == 'true'
        };
        //加载用户信息
        User$.getAvosUserByOpenId(receiverId).done(function (avosUser) {
            $scope.jsonUser = User$.avosUserToJson(avosUser);
            loadChat();
            $scope.$apply();
        });

        //加载聊天记录
        $scope.jsonChats = [];
        function loadChat() {
            Chat$.getChatList_UsedBook_TwoUser(usedBookAvosObjectId, $scope.jsonUser.objectId, User$.getCurrentAvosUser().id).done(function (avosChats) {
                for (var i = 0; i < avosChats.length; i++) {
                    var jsonChat = Chat$.avosChatToJson(avosChats[i]);
                    $scope.jsonChats.push(jsonChat);
                }
                $scope.$apply();
            });
        }

        //常用快捷回复
        $scope.commonReplayWords = [];
        if ($scope.msg.role == 'sell') {//我是卖家
            $scope.commonReplayWords = ['求微信号', '成交', '不能再便宜了', '这本书已经卖出去了'];
        } else {//我是买家
            $scope.commonReplayWords = ['求微信号', '成交', '可以再便宜点吗?', '你在什么地方?', '书有破损吗?'];
        }
        if ($scope.msg.usedBookAvosObjectId) {
            UsedBook$.getJsonUsedBookByAvosObjectId($scope.msg.usedBookAvosObjectId, function (jsonUsedBook) {
                $scope.jsonUsedBook = jsonUsedBook;
                $scope.msg.isPrivate = (jsonUsedBook == null);//没有对应书的发私信
                $scope.$apply();
            });
        }

        //发出消息
        $scope.sendOnClick = function () {
            $scope.isLoading = true;
            Chat$.sendMsgToUser(receiverId, $scope.msg.sendMsg, $scope.msg.usedBookAvosObjectId, $scope.msg.role, $scope.msg.isPrivate).done(function () {
                $scope.jsonChats.push({
                    msg: $scope.msg.sendMsg
                });
                $ionicScrollDelegate.scrollBottom(true);
            }).fail(function (error) {
                alert('发送失败:' + JSON.stringify(error));
            }).always(function () {
                $scope.isLoading = false;
                $scope.msg.sendMsg = '';
                $scope.$apply();
            })
        }
    })

    .controller('signUp', function ($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicModal, WeChatJS$, InfoService$, User$, IonicModalView$) {
        //是否正在加载中..
        $scope.isLoading = true;
        //调用微信接口获取用户信息
        var wechatAOuthCode = $stateParams['code'];
        var shouldGoState = $stateParams['state'];
        WeChatJS$.getOAuthUserInfo(wechatAOuthCode, function (userInfo) {
            $scope.isLoading = false;
            $scope.userInfo = userInfo;
            loginWithUnionId(userInfo.unionId).done(function (me) {//已经注册过
                User$.loadUnreadStatusesCount();//加载未读消息数量
                $state.go(shouldGoState);
                $ionicHistory.clearHistory();
                me.save({//更新微信信息
                    nickName: userInfo['nickname'],
                    sex: userInfo['sex'],
                    avatarUrl: userInfo['headimgurl']
                });
            });
            $scope.$apply();
        });

        IonicModalView$.registerChooseSchoolModalView($scope, function (school) {
            $scope.userInfo['school'] = school;
        });

        IonicModalView$.registerChooseMajorModalView($scope, function (major) {
            $scope.userInfo['major'] = major;
        });

        $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;

        //点击注册时
        $scope.submitOnClick = function () {
            $scope.isLoading = true;
            User$.signUpWithJSONUser($scope.userInfo).done(function () {
                $state.go(shouldGoState);
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
                $scope.$apply();
            })
        };

    })

    .controller('hello', function ($scope, $state, $stateParams, WeChatJS$) {
        var shouldGoState = $stateParams['state'];//验证完成后要去的状态
        loginWithUnionId(readCookie('unionId')).done(function () {//尝试使用cookies登入
            $state.go(shouldGoState);
            $ionicHistory.clearHistory();
        });
        $scope.OAuthURL = WeChatJS$.getOAuthURL(shouldGoState);
    })

    //用户列表
    .controller('userList', function ($scope, $stateParams, UsedBook$, BookRecommend$, User$) {
        var cmd = $stateParams['cmd'];

        $scope.sortWay = '';

        if (cmd == 'near') {
            $scope.title = '你附近的同学';
            $scope.jsonUsers = BookRecommend$.NearUser.jsonUsers;
            $scope.loadMore = BookRecommend$.NearUser.loadMore;
            $scope.hasMore = BookRecommend$.NearUser.hasMore;
        } else if (cmd == 'followee') {//我关注的同学
            $scope.title = '我关注的同学';
            $scope.jsonUsers = User$.Followee.jsonUserList;
            $scope.loadMore = User$.Followee.loadMore;
            $scope.hasMore = User$.Followee.hasMore;
        } else if (cmd == 'follower') {//我的粉丝
            $scope.title = '我的粉丝';
            $scope.jsonUsers = User$.Follower.jsonUserList;
            $scope.loadMore = User$.Follower.loadMore;
            $scope.hasMore = User$.Follower.hasMore;
        }
    })

    .controller('userHome', function ($scope, $stateParams, UsedBook$, User$) {
        $scope.UsedBook$ = UsedBook$;
        var ownerId = $stateParams.ownerId;
        var query = new AV.Query(AV.User);
        $scope.jsonUsedBookList = [];
        query.get(ownerId).done(function (avosOwner) {
            $scope.jsonOwnerInfo = User$.avosUserToJson(avosOwner);
            UsedBook$.loadUsedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
                for (var i = 0; i < avosUsedBooks.length; i++) {
                    $scope.jsonUsedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                }
                $scope.$apply();
            })
        });
    });
