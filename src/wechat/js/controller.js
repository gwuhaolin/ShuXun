/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
//图书推荐
APP.controller('book_recommend', function ($scope, $ionicModal, BookRecommend$) {
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
    .controller('book_searchList', function ($scope, $timeout, $state, SearchBook$, WeChatJS$) {
        $scope.SearchBook$ = SearchBook$;

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

    //图书列表
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
        } else if (cmd == 'new') {
            $scope.books = BookRecommend$.NewBook.books;
            $scope.loadMore = BookRecommend$.NewBook.loadMore;
        } else if (cmd == 'need') {
            $scope.books = BookRecommend$.NeedBook.books;
            $scope.loadMore = BookRecommend$.NeedBook.loadMore;
        } else if (cmd == 'major') {
            $scope.books = BookRecommend$.MajorBook.books;
            $scope.loadMore = BookRecommend$.MajorBook.loadMore;
            $scope.title = BookRecommend$.MajorBook.major;
        } else if (cmd == 'nearBook') {
            $scope.title = '你附近的旧书';
        }
    })

    //二手书列表
    .controller('book_usedBookList', function ($scope, $stateParams, UsedBook$, BookRecommend$) {
        var cmd = $stateParams['cmd'];
        if (cmd == 'near') {
            $scope.title = '你附近的二手书';
            $scope.jsonUsedBooks = BookRecommend$.NearBook.jsonBooks;
            $scope.loadMore = BookRecommend$.NearBook.loadMore;
            $scope.hasMore = function () {
                return BookRecommend$.NearBook.hasMore;
            };
        } else if (cmd == 'isbn') {
            $scope.title = '对应的二手书';
            var isbn13 = $stateParams['isbn13'];
            UsedBook$.ISBN.loadMoreUsedBookEqualISBN(isbn13);
            $scope.jsonUsedBooks = UsedBook$.ISBN.nowEqualISBNJsonUsedBookList;
            $scope.loadMore = UsedBook$.ISBN.loadMoreUsedBookEqualISBN(isbn13);
            $scope.hasMore = function () {
                return UsedBook$.ISBN.hasMore;
            };
        }
    })

    //用户列表
    .controller('book_userList', function ($scope, $stateParams, UsedBook$, BookRecommend$) {
        var cmd = $stateParams['cmd'];
        if (cmd == 'near') {
            $scope.title = '你附近的同学';
            $scope.jsonUsers = BookRecommend$.NearUser.jsonUsers;
            for (var i = 0; i < $scope.jsonUsers.length; i++) {
                var oneJsonUser = $scope.jsonUsers[i];
                UsedBook$.getUsedBookNumberForOwner(oneJsonUser.objectId).done(function (number) {
                    oneJsonUser.usedBookNumber = number;
                    $scope.$apply();
                })
            }
            $scope.loadMore = BookRecommend$.NearUser.loadMore;
            $scope.hasMore = function () {
                return BookRecommend$.NearUser.hasMore;
            }
        }
    })

    //展示一本书详细信息
    .controller('book_oneBook', function ($scope, $sce, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$, UsedBook$, IonicModalView$, BusinessSite$) {
        $scope.$sce = $sce;
        //////////// 豆瓣图书信息 /////////
        $scope.isbn13 = $stateParams.isbn13;
        $scope.book = null;
        //目前是否正在加载数据
        $scope.isLoading = true;
        DoubanBook$.getBookByISBD($scope.isbn13, function (json) {
            json.image = json.image.replace('mpic', 'lpic');//大图显示
            $scope.book = json;
            $scope.isLoading = false;
            $scope.$apply();
            //加载电商联盟信息
            BusinessSite$.getBusinessInfoByISBN(json.id, function (infos) {
                $scope.businessInfos = infos;
            });
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

    .controller('book_usedBookListByOwner', function ($scope, $stateParams, UsedBook$, User$) {
        $scope.UsedBook$ = UsedBook$;
        var ownerId = $stateParams.ownerId;
        var query = new AV.Query(AV.User);
        query.get(ownerId).done(function (avosOwner) {
            $scope.jsonOwnerInfo = User$.avosUserToJson(avosOwner);
            UsedBook$.loadUsedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
                $scope.avosUsedBookList = avosUsedBooks;
                $scope.$apply();
            })
        });
    })

    .controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, WeChatJS$) {
        $scope.WeChatJS$ = WeChatJS$;
        var usedBookAvosObjectId = $stateParams['usedBookAvosObjectId'];
        UsedBook$.getJsonUsedBookByAvosObjectId(usedBookAvosObjectId, function (json) {
            $scope.jsonUsedBook = json;
            var avosOwner = $scope.jsonUsedBook.owner;
            avosOwner.fetch().done(function (avosOwner) {
                $scope.ownerInfo = User$.avosUserToJson(avosOwner);
                $scope.$apply();
            });
            UsedBook$.getUsedBookNumberForOwner(avosOwner.id).done(function (number) {
                $scope.ownerUsedBookNumber = number;
                $scope.$apply();
            });
        })
    })

    ////////////////// person ////////////////////

    .controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicHistory, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, User$) {
        $scope.isLoading = false;
        $scope.WeChatJS$ = WeChatJS$;
        $scope.usedBookInfo = {
            isbn13: $stateParams.isbn13,
            price: null,
            des: null,
            avosImageFile: null
        };
        $scope.usedBookInfo.owner = User$.getCurrentAvosUser();

        $ionicModal.fromTemplateUrl('template/noBarCodeModalView.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.noBarCodeModalView = modal;
        });

        //用$scope.usedBookInfo.isbn13去豆瓣加载图书信息
        function loadDoubanBookInfo() {
            $scope.isLoading = true;
            DoubanBook$.getBookByISBD_simple($scope.usedBookInfo.isbn13, function (json) {
                $scope.doubanBookInfo = json;
                $scope.isLoading = false;
                $scope.$apply();
            });
        }

        if ($scope.usedBookInfo.isbn13) {
            loadDoubanBookInfo();
        }

        $scope.scanQRBtnOnClick = function () {
            WeChatJS$.scanQRCode(function (code) {
                $scope.usedBookInfo.isbn13 = code;
                loadDoubanBookInfo();
            });
        };

        var wechatServerId = '';
        $scope.uploadPicOnClick = function () {
            WeChatJS$.chooseImage(function (localId) {
                $scope.localId = localId;
                $scope.$apply();
                WeChatJS$.uploadImage($scope.localId, function (serverId) {
                    wechatServerId = serverId;
                });
            })
        };

        $scope.submitOnClick = function () {
            $scope.isLoading = true;
            var avosUsedBook = UsedBook$.jsonUsedBookToAvos($scope.usedBookInfo);
            avosUsedBook.save(null).done(function (avosUsedBook) {
                if (wechatServerId) {//如果用户上传了图书的图片到微信
                    AV.Cloud.run('saveWechatImageToUsedBook', {
                        serverId: wechatServerId,
                        objectId: avosUsedBook.id
                    }, null);
                }
                $state.go('tab.person_usedBooksList');
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
            })
        }

    })

    .controller('person_signUp', function ($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicModal, WeChatJS$, InfoService$, User$, IonicModalView$) {
        //是否正在加载中..
        $scope.isLoading = true;
        //调用微信接口获取用户信息
        var wechatAOuthCode = $stateParams['code'];
        WeChatJS$.getOAuthUserInfo(wechatAOuthCode, function (userInfo) {
            $scope.isLoading = false;
            $scope.userInfo = userInfo;
            User$.getAvosUserByUnionId(userInfo.unionId).done(function (avosUser) {
                if (avosUser) {//这个用户已经注册,直接去主页
                    loginWithUnionId(userInfo.unionId).done(function () {
                        $state.go('tab.person_my');
                        $ionicHistory.clearHistory();
                    })
                }
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
                $state.go('tab.person_my');
                $ionicHistory.clearHistory();
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
                $scope.$apply();
            })
        };

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

    .controller('person_my', function ($scope, $state, $stateParams, User$, UsedBook$) {
        function load() {
            $scope.userInfo = User$.getCurrentJsonUser();
            UsedBook$.getUsedBookNumberForOwner(User$.getCurrentAvosUser().id).done(function (number) {
                $scope.myUsedBookNumber = number;
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

    .controller('person_usedBookList', function ($scope, UsedBook$, HasSellUsedBook$) {
        //还没有卖出
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadMyAvosUsedBookList();

        //已经卖出的二手书
        $scope.HasSellUsedBook$ = HasSellUsedBook$;
        HasSellUsedBook$.loadMyAvosUsedBookList();

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

    .controller('person_sendMsgToUser', function ($scope, $state, $stateParams, $ionicHistory, User$) {
        var receiverId = $stateParams['openId'];
        $scope.msg = {
            receiveMsg: $stateParams['msg'],
            sendMsg: ''
        };
        User$.getAvosUserByOpenId(receiverId).done(function (avosUser) {
            $scope.jsonUser = User$.avosUserToJson(avosUser);
            $scope.$apply();
        });

        /**
         * 发出消息
         */
        $scope.sendOnClick = function () {
            User$.sendMsgToUser(receiverId, $scope.msg['sendMsg'], function () {
                alert('回复成功');
                $state.go('tab.person_my');
                $ionicHistory.clearHistory();
            }, function (error) {
                alert('发送失败:' + error['errmsg']);
            })
        }
    })

    .controller('person_hello', function ($scope, WeChatJS$) {
        $scope.WeChatJS$ = WeChatJS$;
    });
