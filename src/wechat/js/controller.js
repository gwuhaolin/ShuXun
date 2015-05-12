/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
//图书推荐
APP.controller('tabs', function ($scope, Status$) {
    $scope.Status$ = Status$;
})
    .controller('book_recommend', function ($scope, $ionicModal, BookRecommend$, User$, LatestBook$) {
        $scope.User$ = User$;
        $scope.BookRecommend$ = BookRecommend$;
        $scope.LatestBook$ = LatestBook$;
        LatestBook$.loadMore();
        BookRecommend$.MajorBook.loadMore();
        BookRecommend$.NearUsedBook.loadMore();
        BookRecommend$.NearNeedBook.loadMore();
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
    .controller('book_bookList', function ($scope, $stateParams, BookRecommend$, LatestBook$) {
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
            $scope.books = BookRecommend$.NearNeedBook.books;
            $scope.loadMore = BookRecommend$.NearNeedBook.loadMore;
            $scope.hasMore = BookRecommend$.NearNeedBook.hasMore;
        } else if (cmd == 'major') {
            $scope.books = BookRecommend$.MajorBook.books;
            $scope.loadMore = BookRecommend$.MajorBook.loadMore;
            $scope.title = BookRecommend$.MajorBook.major;
            $scope.hasMore = BookRecommend$.MajorBook.hasMore;
        } else if (cmd == 'new') {
            $scope.books = LatestBook$.jsonBooks;
            $scope.loadMore = LatestBook$.loadMore;
            $scope.title = '新书速递';
            $scope.hasMore = LatestBook$.hasMore;
        }
    })

    //二手书列表
    .controller('book_usedBookList', function ($scope, $stateParams, UsedBook$, BookRecommend$) {
        $scope.cmd = $stateParams['cmd'];
        $scope.sortWay = '';
        if ($scope.cmd == 'nearUsed') {
            $scope.title = '你附近的二手书';
            $scope.jsonUsedBooks = BookRecommend$.NearUsedBook.jsonBooks;
            $scope.loadMore = BookRecommend$.NearUsedBook.loadMore;
            $scope.hasMore = BookRecommend$.NearUsedBook.hasMore;
        } else if ($scope.cmd == 'nearNeed') {
            $scope.title = '你附近的求书';
            $scope.jsonUsedBooks = BookRecommend$.NearNeedBook.jsonBooks;
            $scope.loadMore = BookRecommend$.NearNeedBook.loadMore;
            $scope.hasMore = BookRecommend$.NearNeedBook.hasMore;
        } else if ($scope.cmd == 'isbnUsed') {
            $scope.title = '对应要卖的旧书';
            $scope.isbn13 = $stateParams['isbn13'];
            $scope.jsonUsedBooks = UsedBook$.ISBN_sell.nowEqualISBNJsonUsedBookList;
            $scope.loadMore = UsedBook$.ISBN_sell.loadMoreUsedBookEqualISBN;
            $scope.hasMore = UsedBook$.ISBN_sell.hasMore;
        } else if ($scope.cmd == 'isbnNeed') {
            $scope.title = '需要这本书的同学';
            $scope.isbn13 = $stateParams['isbn13'];
            $scope.jsonUsedBooks = UsedBook$.ISBN_need.nowEqualISBNJsonNeedBookList;
            $scope.loadMore = UsedBook$.ISBN_need.loadMoreNeedBookEqualISBN;
            $scope.hasMore = UsedBook$.ISBN_need.hasMore;
        }
    })

    //展示一本书详细信息
    .controller('book_oneBook', function ($scope, $state, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$, UsedBook$, IonicModalView$, BusinessSite$, User$) {
        $scope.User$ = User$;
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
            var title = $scope.book['author'].toString();
            var pre = $scope.book['author_intro'];
            IonicModalView$.alertTitleAndPreModalView(title, pre);
        };
        //显示出版信息
        $scope.showPubInfo = function () {
            var title = '出版信息';
            var b = $scope.book;
            var pre = '作者:' + b['author'].toString() +
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
        UsedBook$.ISBN_sell.getUsedBookNumberEqualISBN($scope.isbn13).done(function (number) {
            //对应的图书有多少本二手书
            $scope.usedBookNumber = number;
        });
        UsedBook$.ISBN_sell.loadMoreUsedBookEqualISBN($scope.isbn13);//先加载5个

        //////////// 求书信息 /////////
        UsedBook$.ISBN_need.getNeedBookNumberEqualISBN($scope.isbn13).done(function (number) {
            //对应的图书有多少本二手书
            $scope.needBookNumber = number;
        });
        UsedBook$.ISBN_need.loadMoreNeedBookEqualISBN($scope.isbn13);//先加载5个

        $scope.WeChatJS$ = WeChatJS$;
    })

    .controller('book_bookReview', function ($scope, $stateParams, DoubanBook$) {
        $scope.BookReview = DoubanBook$.BookReview;
        $scope.BookReview.nowBookId = $stateParams['doubanBookId'];
        $scope.title = $stateParams['bookTitle'] + ' 书评';
        $scope.$on('$ionicView.afterLeave', function () {
            $scope.BookReview.clear();
        });
    })

    .controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, WeChatJS$, Status$) {
        $scope.User$ = User$;
        $scope.WeChatJS$ = WeChatJS$;
        $scope.usedBookObjectId = $stateParams['usedBookAvosObjectId'];

        UsedBook$.getJsonUsedBookByAvosObjectId($scope.usedBookObjectId, function (json) {
            json.image = json.image ? json.image.replace('mpic', 'lpic') : '';//大图显示
            $scope.jsonUsedBook = json;
            $scope.$apply();
            var avosOwner = $scope.jsonUsedBook.owner;
            avosOwner.fetch().done(function (avosOwner) {
                $scope.ownerInfo = avosUserToJson(avosOwner);
                $scope.$apply();
            });
        });

        //加载评论数据
        Status$.getStatusList_reviewBook($scope.usedBookObjectId).done(function (avosStatusList) {
            $scope.jsonStatusList = [];
            for (var i = 0; i < avosStatusList.length; i++) {
                var jsonStatus = Status$.avosStatusToJson(avosStatusList[i]);
                jsonStatus.source.fetch().done(function () {
                    $scope.$apply();
                });
                jsonStatus.to.fetch().done(function () {
                    $scope.$apply();
                });
                $scope.jsonStatusList.push(jsonStatus);
            }
            $scope.$apply();
        })
    })

    ////////////////// person ////////////////////

    .controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, User$) {
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
            $ionicScrollDelegate.scrollTop();
            if ($scope.usedBookInfo.isbn13) {
                loadDoubanBookInfo();
            }
            $scope.usedBookInfo.owner = User$.getCurrentAvosUser();
        });

        $ionicModal.fromTemplateUrl('template/helpModalView.html', {
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

        /**
         * @param role 是要卖掉二手书(sell)还是发布需求(need)
         */
        $scope.submitOnClick = function (role) {
            $scope.usedBookInfo.role = role;
            $scope.isLoading = true;
            var avosUsedBook = UsedBook$.jsonUsedBookToAvos($scope.usedBookInfo);
            avosUsedBook.save(null).done(function () {
                if (role == 'sell') {
                    UsedBook$.loadMyAvosUsedBookList();
                    $state.go('tab.person_usedBooksList');
                } else if (role == 'need') {
                    UsedBook$.loadMyAvosNeedBookList();
                    $state.go('tab.person_needBooksList');
                }
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

        $scope.confirmWechatAlert = function () {
            if ($scope.userInfo.wechatAlert == false) {
                $scope.userInfo.wechatAlert = !window.confirm('关闭后有同学给你发消息时你将收不到通知,确定关闭吗?');
            }
        };

        //点击提交修改时
        $scope.submitOnClick = function () {
            var unionId = readCookie('unionId');
            User$.loginWithUnionId(unionId).done(function (avosUser) {
                avosUser.fetchWhenSave(true);
                avosUser.save({
                    school: $scope.userInfo['school'],
                    major: $scope.userInfo['major'],
                    startSchoolYear: $scope.userInfo['startSchoolYear'],
                    wechatAlert: $scope.userInfo['wechatAlert']
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

    .controller('person_my', function ($scope, $state, $stateParams, User$, Status$) {
        $scope.Status$ = Status$;
        function load() {
            $scope.userInfo = User$.getCurrentJsonUser();
            //加载我上传的二手书的数量
            var myUsedBookRelation = User$.getCurrentAvosUser().relation('usedBooks');
            var query = myUsedBookRelation.query();
            query.equalTo('role', 'sell');
            query.count().done(function (number) {
                $scope.myUsedBookNumber = number;
                $scope.$apply();
            });
            //加载我发布的求书需求的数量
            query = myUsedBookRelation.query();
            query.equalTo('role', 'need');
            query.count().done(function (number) {
                $scope.myNeedBookNumber = number;
                $scope.$apply();
            });
            //加载我关注的同学的数量
            query = AV.User.current().followeeQuery();
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

    .controller('person_usedBookList', function ($scope, $ionicScrollDelegate, UsedBook$) {
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadMyAvosUsedBookList();
        $scope.$on('$ionicView.afterEnter', function () {
            $ionicScrollDelegate.scrollTop(true);
        });
    })

    .controller('person_needBookList', function ($scope, $ionicScrollDelegate, UsedBook$) {
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadMyAvosNeedBookList();
        $scope.$on('$ionicView.afterEnter', function () {
            $ionicScrollDelegate.scrollTop(true);
        });
    })

    .controller('person_statusList', function ($scope, $stateParams, Status$) {
        $scope.cmd = $stateParams.cmd;
        if ($scope.cmd == 'newUsedBook') {//显示上传的二手书
            $scope.title = '同学新上传的旧书';
            $scope.avosStatusList = Status$.NewUsedBookStatus.avosStatusList;
            Status$.NewUsedBookStatus.loadMore();
            Status$.NewUsedBookStatus.unreadCount = 0;
        } else if ($scope.cmd == 'newNeedBook') {//显示发布的求书
            $scope.title = '同学新发布的求书';
            $scope.avosStatusList = Status$.NewNeedBookStatus.avosStatusList;
            Status$.NewNeedBookStatus.loadMore();
            Status$.NewNeedBookStatus.unreadCount = 0;
        }
    })

    .controller('person_editOneUsedBook', function ($scope, $state, $ionicHistory, $stateParams, UsedBook$) {
        var usedBookId = $stateParams['usedBookId'];
        $scope.avosUsedBook = AV.Object.createWithoutData('UsedBook', usedBookId);
        $scope.avosUsedBook.fetch().done(function () {
            $scope.jsonUsedBookChangeInfo = UsedBook$.avosUsedBookToJson($scope.avosUsedBook);
            $scope.$apply();
        });
        $scope.valueHasChange = false;
        $scope.submitOnClick = function () {
            $scope.avosUsedBook.set('des', $scope.jsonUsedBookChangeInfo.des);
            $scope.avosUsedBook.set('price', $scope.jsonUsedBookChangeInfo.price);
            $scope.avosUsedBook.save(null).done(function () {
                if ($scope.avosUsedBook.get('role') == 'sell') {
                    UsedBook$.loadMyAvosUsedBookList();
                    $state.go('tab.person_usedBooksList');
                } else if ($scope.avosUsedBook.get('role') == 'need') {
                    UsedBook$.loadMyAvosNeedBookList();
                    $state.go('tab.person_needBooksList');
                }
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            })
        }
    })

    .controller('person_sendMsgToUser', function ($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, User$, UsedBook$, Status$) {
        var receiverObjectId = $stateParams['receiverObjectId'];//消息接受者的AVOS ID
        if (!receiverObjectId) {//如果参数为空,说明进入了bug状态,要用户重新打开页面
            alert('遇到了一个问题,重新打开一下就OK了~');
            wx.closeWindow();
        }
        $scope.isLoading = false;
        $scope.msg = {
            inboxType: $stateParams['inboxType'],//必须
            role: $stateParams['role'],//我当前是买家还是卖家,必须
            sendMsg: '',//必须
            usedBookObjectId: $stateParams['usedBookObjectId']//在私信下为空
        };

        //当前聊天模式
        $scope.nowModel = function () {
            if ($scope.msg.inboxType == 'private') {//发私信
                if ($scope.msg.role == 'sell') {
                    return '回应卖家的私信';
                } else if ($scope.msg.role == 'buy') {
                    return '给图书主人发私信';
                }
            } else if ($scope.msg.inboxType == 'reviewUsedBook') {//评价二手书
                if ($scope.msg.role == 'sell') {
                    return '回复买家对旧书的评论';
                } else if ($scope.msg.role == 'buy') {
                    return '对主人的旧书发表评论';
                }
            }
        };

        //加载用户信息
        AV.Object.createWithoutData('_User', receiverObjectId).fetch().done(function (avosUser) {
            $scope.jsonUser = avosUserToJson(avosUser);
            $scope.$apply();
        });

        //加载聊天记录
        $scope.jsonStatusList = [];
        Status$.getStatusList_twoUser(receiverObjectId, $scope.msg.usedBookObjectId).done(function (avosStatusList) {
            for (var i = 0; i < avosStatusList.length; i++) {
                $scope.jsonStatusList.push(Status$.avosStatusToJson(avosStatusList[i]));
            }
        });

        //常用快捷回复
        $scope.commonReplayWords = [];
        if ($scope.msg.role == 'sell') {//我是卖家
            $scope.commonReplayWords = ['求微信号', '成交', '不能再便宜了', '这本书已经卖出去了'];
        } else {//我是买家
            $scope.commonReplayWords = ['求微信号', '成交', '可以再便宜点吗?', '你在什么地方?', '书有破损吗?'];
        }

        //加载二手书信息
        if ($scope.msg.usedBookObjectId) {
            UsedBook$.getJsonUsedBookByAvosObjectId($scope.msg.usedBookObjectId, function (jsonUsedBook) {
                $scope.jsonUsedBook = jsonUsedBook;
                $scope.$apply();
            });
        }

        //发出消息
        $scope.sendOnClick = function () {
            $scope.isLoading = true;
            var promise;
            if ($scope.msg.inboxType == 'private') {
                promise = Status$.sendPrivateMsg(receiverObjectId, $scope.msg.sendMsg, $scope.msg.role, $scope.msg.usedBookObjectId);
            } else if ($scope.msg.inboxType == 'reviewUsedBook') {
                promise = Status$.reviewUsedBook(receiverObjectId, $scope.msg.usedBookObjectId, $scope.msg.sendMsg, $scope.msg.role);
            }
            promise.done(function () {
                $scope.jsonStatusList.push({
                    message: $scope.msg.sendMsg
                });
                $ionicScrollDelegate.scrollBottom(true);
            }).fail(function (err) {
                alert('发送失败:' + JSON.stringify(err));
            }).always(function () {
                $scope.isLoading = false;
                $scope.msg.sendMsg = '';
                $scope.$apply();
            });
        }
    })

    .controller('signUp', function ($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicModal, WeChatJS$, InfoService$, User$, Status$, IonicModalView$) {
        //是否正在加载中..
        $scope.isLoading = true;
        //调用微信接口获取用户信息
        var wechatAOuthCode = $stateParams['code'];
        var nextState = $stateParams['state'];
        WeChatJS$.getOAuthUserInfo(wechatAOuthCode, function (userInfo) {
            $scope.isLoading = false;
            $scope.userInfo = userInfo;
            User$.loginWithUnionId(userInfo.unionId).done(function (me) {//已经注册过
                Status$.loadUnreadStatusesCount();//加载未读消息数量
                $state.go(nextState);
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
                $state.go(nextState);
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
                $scope.$apply();
            })
        };

    })

    .controller('hello', function ($scope, $state, $stateParams, WeChatJS$, User$) {
        var nextState = $stateParams['nextState'];//验证完成后要去的状态
        User$.loginWithUnionId(readCookie('unionId')).done(function () {//尝试使用cookies登入
            $state.go(nextState);
            $ionicHistory.clearHistory();
        });
        $scope.OAuthURL = WeChatJS$.getOAuthURL(nextState);
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
        $scope.jsonNeedBookList = [];
        query.get(ownerId).done(function (avosOwner) {
            $scope.jsonOwnerInfo = avosUserToJson(avosOwner);
            UsedBook$.loadUsedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
                for (var i = 0; i < avosUsedBooks.length; i++) {
                    $scope.jsonUsedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                }
                $scope.$apply();
            });
            UsedBook$.loadNeedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
                for (var i = 0; i < avosUsedBooks.length; i++) {
                    $scope.jsonNeedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                }
                $scope.$apply();
            })
        });
    });
