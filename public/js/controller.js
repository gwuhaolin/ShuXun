/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
angular.module('AppController', [], null)

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

    //展示一本书详细信息
    .controller('book_oneBook', function ($scope, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$, UsedBook$, IonicModalView$, BusinessSite$) {
        //////////// 豆瓣图书信息 /////////
        $scope.isbn13 = $stateParams.isbn13;
        $scope.book = null;
        //目前是否正在加载数据
        $scope.isLoading = true;
        DoubanBook$.getBookByISBD($scope.isbn13, function (json) {
            $scope.book = json;
            $scope.isLoading = false;
            $scope.$apply();
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

        //加载电商联盟信息
        BusinessSite$.getBusinessInfoByISBN($scope.isbn13, function (infos) {
            $scope.businessInfos = infos;
        });

        //////////// 二手书信息 /////////
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.getUsedBookNumberEqualISBN($scope.isbn13).done(function (number) {
            //对应的图书有多少本二手书
            $scope.usedBookNumber = number;
        });
        UsedBook$.loadMoreAvosUsedBookEqualISBN($scope.isbn13);//先加载5个

        $scope.WeChatJS$ = WeChatJS$;
    })

    .controller('book_BusinessSite', function ($scope, $stateParams) {
        $scope.url = $stateParams.url;
    })

    .controller('book_usedBookListByISBN', function ($scope, $stateParams, UsedBook$) {
        var isbn13 = $stateParams.isbn13;
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.getUsedBookNumberEqualISBN(isbn13).done(function (number) {
            $scope.usedBookTotalNumber = number;
            $scope.$apply();
        });
        $scope.loadMore = function () {
            UsedBook$.loadMoreAvosUsedBookEqualISBN(isbn13);
        }
    })

    .controller('book_usedBookListByOwner', function ($scope, $stateParams, UsedBook$) {
        var ownerId = $stateParams.ownerId;
        var avosOwner = new AV.User();
        avosOwner.id = ownerId;
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadUsedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
            $scope.avosUsedBookList = avosUsedBooks;
            $scope.$apply();
        })
    })

    .controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$,WeChatJS$) {
        $scope.WeChatJS$ = WeChatJS$;
        var usedBookAvosObjectId = $stateParams['usedBookAvosObjectId'];
        UsedBook$.getJsonUsedBookByAvosObjectId(usedBookAvosObjectId, function (json) {
            $scope.jsonUsedBook = json;
            var avosOwner = $scope.jsonUsedBook.owner;
            avosOwner.fetch().done(function (avosOwner) {
                $scope.ownerInfo = User$.avosUserToJson(avosOwner);
                $scope.$apply();
            });
            UsedBook$.getUsedBookNumberForOwner(avosOwner).done(function (number) {
                $scope.ownerUsedBookNumber = number;
                $scope.$apply();
            });
        })
    })

    ////////////////// person ////////////////////

    .controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, User$,IonicModalView$) {
        $scope.isLoading = false;

        $scope.usedBookInfo = {
            isbn13: $stateParams.isbn13,
            price: null,
            des: null,
            avosImageFile: null
        };
        if (!User$.getCurrentAvosUser()) {
            IonicModalView$.alertUserLoginModalView('你需要先登入', function (avosUser) {
                $scope.usedBookInfo.owner = avosUser;
            })
        } else {
            $scope.usedBookInfo.owner = User$.getCurrentAvosUser();
        }

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

        var wechatServerId='';
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
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
            })
        }

    })

    .controller('person_signUp', function ($scope, $timeout, $stateParams, $ionicModal, WeChatJS$, InfoService$, User$, IonicModalView$) {
        //是否正在加载中..
        $scope.isLoading = true;
        //调用微信接口获取用户信息
        var wechatAOuthCode = $stateParams['code'];
        WeChatJS$.getOAuthUserInfo(wechatAOuthCode, function (userInfo) {
            $scope.isLoading = false;
            $scope.userInfo = userInfo;
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
            User$.signUpWithJSONUser($scope.userInfo).done(function (avosUser) {
                alert(JSON.stringify(User$.avosUserToJson(avosUser)));
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
                $scope.$apply();
            })
        };

    })

    .controller('person_editPersonInfo', function ($scope, InfoService$, User$, IonicModalView$) {
        //是否对属性进行了修改
        $scope.attrHasChange = false;

        if (!User$.getCurrentAvosUser()) {//还没有用户的信息
            IonicModalView$.alertUserLoginModalView('你还没有登入', function () {
                $scope.userInfo = User$.getCurrentJsonUser();
            })
        } else {
            $scope.userInfo = User$.getCurrentJsonUser();
        }

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
            IonicModalView$.alertUserLoginModalView('修改前需要验证身份', function (avosUser) {
                avosUser.save({
                    school: $scope.userInfo['school'],
                    major: $scope.userInfo['major'],
                    startSchoolYear: $scope.userInfo['startSchoolYear']
                }, function () {
                    alert('修改成功');
                }, function (error) {
                    alert('修改失败:' + error.message);
                })
            });
        }
    })

    .controller('person_my', function ($scope, User$) {
        $scope.userInfo = User$.getCurrentJsonUser();
    })

    .controller('person_usedBookList', function ($scope, UsedBook$, HasSellUsedBook$, User$) {
        User$.checkUsedHasLogin(function () {
            UsedBook$.loadMyAvosUsedBookList();
            HasSellUsedBook$.loadMyAvosUsedBookList();
        });
        //还没有卖出
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadMyAvosUsedBookList();

        //已经卖出的二手书
        $scope.HasSellUsedBook$ = HasSellUsedBook$;
        HasSellUsedBook$.loadMyAvosUsedBookList();

    })

    .controller('person_editOneUsedBook', function ($scope, $state, $stateParams, UsedBook$) {
        var indexInMyAvosUsedBook_notSell = $stateParams['indexInMyAvosUsedBook_notSell'];
        $scope.avosUsedBook = UsedBook$.myAvosUsedBookList[indexInMyAvosUsedBook_notSell];
        $scope.valueHasChange = false;
        $scope.jsonUsedBookChangeInfo = UsedBook$.avosUsedBookToJson($scope.avosUsedBook);
        $scope.submitOnClick = function () {
            $scope.avosUsedBook.set('des', $scope.jsonUsedBookChangeInfo.des);
            $scope.avosUsedBook.set('price', $scope.jsonUsedBookChangeInfo.price);
            $scope.avosUsedBook.save(null).done(function () {
                $state.go('tab.person_usedBooksList');
            }).fail(function (error) {
                alert(error.message);
            })
        }
    });
