/**
 * Created by wuhaolin on 3/26/15.
 *
 */
"use strict";
angular.module('AppController', [], null)

    //图书搜索
    .controller('book_searchList', function ($scope, $timeout, $state, SearchBook$, WeChatJS$) {
        $scope.SearchBook$ = SearchBook$;
        $scope.searchBtnOnClick = function () {
            SearchBook$.loadMore();
            $timeout.cancel(timer);
        };

        var timer = null;
        $scope.searchInputOnChange = function () {
            SearchBook$.books = [];
            SearchBook$.totalNum = 0;
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $scope.searchBtnOnClick();
            }, 2000);
        };

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
    .controller('book_oneBook', function ($scope, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$, UsedBook$) {
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
            InfoService$.alertTitleAndPreModalView(title, pre);
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
            InfoService$.alertTitleAndPreModalView(title, pre);
        };

        //显示图书简介
        $scope.showSummary = function () {
            var title = '图书简介';
            var pre = $scope.book.summary;
            InfoService$.alertTitleAndPreModalView(title, pre);
        };

        //预览图书的封面
        $scope.previewBookImg = function () {
            WeChatJS$.previewOneImage($scope.book.image);
        };

        //////////// 二手书信息 /////////
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.getNotSellUsedBookNumberEqualISBN($scope.isbn13).done(function (number) {
            //对应的图书有多少本二手书
            $scope.usedBookNumber = number;
        });
        UsedBook$.loadMoreNotSellAvosUsedBookEqualISBN($scope.isbn13);//先加载5个

    })

    .controller('book_usedBookList', function ($scope, $stateParams, UsedBook$) {
        var isbn13 = $stateParams.isbn13;
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.getNotSellUsedBookNumberEqualISBN(isbn13).done(function (number) {
            $scope.notSellUsedBookTotalNumber = number;
        });
        $scope.loadMore = function () {
            UsedBook$.loadMoreNotSellAvosUsedBookEqualISBN(isbn13);
        }
    })

    .controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$) {
        var usedBookAvosObjectId = $stateParams['usedBookAvosObjectId'];
        UsedBook$.getJsonUsedBookByAvosObjectId(usedBookAvosObjectId, function (json) {
            $scope.jsonUsedBook = json;
            var avosOwner = $scope.jsonUsedBook.owner;
            avosOwner.fetch().done(function (avosOwner) {
                $scope.ownerInfo = User$.avosUserToJson(avosOwner);
            });
            UsedBook$.loadNotSellUsedBookListForOwner(avosOwner, function (avosUsedBooks) {
                $scope.ownerJsonUsedBookList = [];
                for (var i = 0; i < avosUsedBooks.length; i++) {
                    if (avosUsedBooks[i].id == usedBookAvosObjectId) {
                        continue;
                    }
                    $scope.ownerJsonUsedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
                }
                $scope.$apply();
            })
        })
    })

    .controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, UsedBook$, User$) {
        $scope.isLoading = false;

        $scope.usedBookInfo = {
            isbn13: $stateParams.isbn13,
            price: null,
            des: null,
            avosImageFile: null
        };
        if (!User$.getCurrentAvosUser()) {
            User$.alertUserLoginModalView('你需要先登入', function (avosUser) {
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

        var wechatServerId;
        $scope.uploadPicOnClick = function () {
            WeChatJS$.chooseImage(function (localId) {
                $scope.localId = localId;
                WeChatJS$.uploadImage($scope.localId, function (serverId) {
                    wechatServerId = serverId;
                });
                $scope.$apply();
            })
        };

        $scope.submitOnClick = function () {
            $scope.isLoading = true;
            var avosUsedBook = UsedBook$.jsonUsedBookToAvos($scope.usedBookInfo);
            avosUsedBook.save(null).done(function (avosUsedBook) {
                if (wechatServerId) {//如果用户上传了图书的图片到微信
                    AV.Cloud.run('saveWechatImageToUsedBook', {
                        serverId: wechatServerId,
                        objectId: avosUsedBook.objectId
                    }, null).done(function () {
                        alert('AVOS下载图片成功');
                    }).fail(function (error) {
                        alert(error.message);
                    })
                }
                $state.go('tab.person_usedBooksList');
            }).fail(function (error) {
                alert(error.message);
            }).always(function () {
                $scope.isLoading = false;
            })
        }

    })

    .controller('person_signUp', function ($scope, $timeout, $stateParams, $ionicModal, WeChatJS$, InfoService$, User$) {
        //是否正在加载中..
        $scope.isLoading = true;
        //调用微信接口获取用户信息
        var wechatAOuthCode = $stateParams['code'];
        WeChatJS$.getOAuthUserInfo(wechatAOuthCode, function (userInfo) {
            $scope.isLoading = false;
            $scope.userInfo = userInfo;
        });

        InfoService$.registerChooseSchoolModalView($scope, function (school) {
            $scope.userInfo['school'] = school;
        });

        InfoService$.registerChooseMajorModalView($scope, function (major) {
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

    .controller('person_editPersonInfo', function ($scope, InfoService$, User$) {
        //是否对属性进行了修改
        $scope.attrHasChange = false;

        if (!User$.getCurrentAvosUser()) {//还没有用户的信息
            User$.alertUserLoginModalView('你还没有登入', function () {
                $scope.userInfo = User$.getCurrentJsonUser();
            })
        } else {
            $scope.userInfo = User$.getCurrentJsonUser();
        }

        InfoService$.registerChooseSchoolModalView($scope, function (school) {
            $scope.attrHasChange = true;
            $scope.userInfo['school'] = school;
        });
        InfoService$.registerChooseMajorModalView($scope, function (major) {
            $scope.attrHasChange = true;
            $scope.userInfo['major'] = major;
        });
        $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;

        //点击提交修改时
        $scope.submitOnClick = function () {
            User$.alertUserLoginModalView('修改前需要验证身份', function (avosUser) {
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

    .controller('person_hello', function ($scope, WeChatJS$) {
        $scope.WeChatJS$ = WeChatJS$;
    })

    .controller('person_my', function ($scope, User$) {
        $scope.userInfo = User$.getCurrentJsonUser();
    })

    .controller('person_usedBookList', function ($scope, UsedBook$) {
        $scope.UsedBook$ = UsedBook$;
        UsedBook$.loadMyAvosUsedBookList();

        /**
         * 删除一本二手书
         * @param avosUsedBook
         */
        $scope.removeUsedBook = function (avosUsedBook) {
            if (window.confirm('你确定要删除它吗?')) {
                avosUsedBook.destroy().done(function () {
                    UsedBook$.loadMyAvosUsedBookList();
                }).fail(function (error) {
                    alert(error.message);
                })
            }
        };

        /**
         * 把一本二手书设置为已经卖出
         * @param avosUsedBook
         */
        $scope.usedBookHasSell = function (avosUsedBook) {
            if (window.confirm('你确定它已经卖出了吗?')) {
                avosUsedBook.set('hasSell', true);
                avosUsedBook.save(null).done(function () {
                    UsedBook$.loadMyAvosUsedBookList();
                }).fail(function (error) {
                    alert(error.message);
                })
            }
        }
    })

    .controller('person_editOneUsedBook', function ($scope, $state, $stateParams, UsedBook$) {
        var indexInMyAvosUsedBook_notSell = $stateParams['indexInMyAvosUsedBook_notSell'];
        $scope.avosUsedBook = UsedBook$.myAvosUsedBookList_notSell[indexInMyAvosUsedBook_notSell];
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
