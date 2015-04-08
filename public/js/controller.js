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
    .controller('book_oneBook', function ($scope, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$) {
        var isbn13 = $stateParams.isbn13;
        $scope.book = null;
        //目前是否正在加载数据
        $scope.isLoading = true;
        DoubanBook$.getBookByISBD(isbn13, function (json) {
            $scope.book = json;
            $scope.isLoading = false;
        });

        //显示作者介绍
        $scope.showAuthorIntro = function () {
            var title = $scope.book.author.toString();
            var pre = $scope.book.author_intro;
            InfoService$.alertTitleAndPreModalView(title, pre);
        };
        //显示出版信息
        $scope.showPubInfo = function () {
            var title = '出版信息';
            var b = $scope.book;
            var pre = '作者:' + b.author.toString() +
                '\n出版社:' + b.publisher +
                '\n出版年:' + b.pubdate +
                '\n页数:' + b.pages +
                '\n定价:' + b.price +
                '\n装帧:' + b.binding +
                '\nISBN:' + b.isbn13 +
                '\n目录:\n' + b.catalog;
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
        }

    })

    .controller('person_uploadOneUsedBook', function ($scope, $state, DoubanBook$, WeChatJS$, UsedBook$) {

        $scope.isLoading = false;

        $scope.usedBookInfo = {
            isbn13: '',
            price: 0,
            des: '',
            avosImageFile: null
        };

        //TODO 有些书没有条形码了,可以先去搜索哪里
        $scope.scanQRBtnOnClick = function () {
            $scope.isLoading = true;
            WeChatJS$.scanQRCode(function (code) {
                $scope.usedBookInfo.isbn13 = code;
                DoubanBook$.getBookByISBD_simple($scope.usedBookInfo.isbn13, function (json) {
                    $scope.book = json;
                    $scope.isLoading = false;
                    $scope.$apply();
                });
            });
        };

        $scope.uploadPicOnClick = function () {
            WeChatJS$.chooseImage(function (localId) {
                $scope.localId = localId;
                WeChatJS$.uploadImage($scope.localId, function (serverId) {
                    $scope.isLoading = true;
                    UsedBook$.saveWechatImageToAVOS(serverId).then(function (avosFile) {
                        //TODO 这里被没有调用
                        $scope.usedBookInfo.avosImageFile = avosFile;
                        $scope.isLoading = false;
                        alert(JSON.stringify(avosFile));
                    }, function (error) {
                        alert('图片上传失败:' + error.message);
                    });
                });
                $scope.$apply();
            })
        };

        $scope.submitOnClick = function () {
            $scope.isLoading = true;
            var avosUsedBook = UsedBook$.jsonUsedBookToAvos($scope.usedBookInfo);
            //TODO 添加 ACL权限控制
            avosUsedBook.save(null).done(function () {
                $state.go('tab.person_usedBooksList');
            }).fail(function (error) {
                $scope.isLoading = false;
                alert(error.message);
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
    })

    .controller('person_editOneUsedBook', function ($scope) {

    });
