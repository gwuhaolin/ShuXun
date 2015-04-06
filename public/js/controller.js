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
    .controller('book_oneBook', function ($scope, $stateParams, $ionicModal, DoubanBook$, WeChatJS$) {
        var isbn13 = $stateParams.isbn13;
        $scope.book = null;
        //目前是否正在加载数据
        $scope.isLoading = true;
        DoubanBook$.getBookByISBD(isbn13, function (json) {
            $scope.book = json;
            $scope.isLoading = false;
        });

        //注册modal视图
        $scope.modalViewData = {};
        $ionicModal.fromTemplateUrl('template/authorIntro.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalView = modal;
        });

        //显示作者介绍
        $scope.showAuthorIntro = function () {
            $scope.modalViewData.title = $scope.book.author.toString();
            $scope.modalViewData.content = $scope.book.author_intro;
            $scope.modalView.show();
        };
        //显示出版信息
        $scope.showPubInfo = function () {
            $scope.modalViewData.title = '出版信息';
            var b = $scope.book;
            $scope.modalViewData.content = '作者:' + b.author.toString() +
            '\n出版社:' + b.publisher +
            '\n出版年:' + b.pubdate +
            '\n页数:' + b.pages +
            '\n定价:' + b.price +
            '\n装帧:' + b.binding +
            '\nISBN:' + b.isbn13 +
            '\n目录:\n' + b.catalog;
            $scope.modalView.show();
        };
        //显示图书简介
        $scope.showSummary = function () {
            $scope.modalViewData.title = '图书简介';
            $scope.modalViewData.content = $scope.book.summary;
            $scope.modalView.show();
        };

        //预览图书的封面
        $scope.previewBookImg = function () {
            WeChatJS$.previewOneImage($scope.book.image);
        }

    })

    .controller('person_uploadOneUsedBook', function ($scope, DoubanBook$, WeChatJS$) {

        $scope.isLoading = false;

        $scope.scanQRBtnOnClick = function () {
            $scope.isLoading = true;
            WeChatJS$.scanQRCode(function (code) {
                $scope.isbn13 = code;
                DoubanBook$.getBookByISBD_simple($scope.isbn13, function (json) {
                    $scope.book = json;
                    $scope.isLoading = false;
                    $scope.$apply();
                });
            });
        };

        $scope.uploadPicOnClick = function () {
            WeChatJS$.chooseImage(function (localSrc) {
                $scope.uploadPicSrc = localSrc;
                $scope.$apply();
            })
        };

        $scope.submitOnClick = function () {
            //TODO
            //$scope.price;
            //$scope.des;
        }

    })

    .controller('person_signUp', function ($scope, $timeout, $stateParams, $ionicModal, WeChatJS$, InfoService$) {
        //调用微信接口获取用户信息
        var wechatAOuthCode = $stateParams['code'];
        WeChatJS$.getOAuthUserInfo(wechatAOuthCode, function (userInfo) {
            $scope.userInfo = userInfo;
        });

        $scope.InfoService$ = InfoService$;
        //选中了学校
        $ionicModal.fromTemplateUrl('template/chooseSchool.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.chooseSchoolModalView = modal;
        });
        $scope.schoolOnChoose = function (school) {
            $scope.userInfo['school'] = school;
            $scope.chooseSchoolModalView.hide();
        };

        //选中了专业
        $ionicModal.fromTemplateUrl('template/chooseMajor.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.chooseMajorModalView = modal;
        });
        $scope.majorOnChoose = function (major) {
            $scope.userInfo['major'] = major;
            $scope.chooseMajorModalView.hide();
        };

        //开始上大学时间所有选项 ,6年前到今年
        $scope.startSchoolYearOptions = [];
        {
            var currentYear = new Date().getFullYear();
            for (var year = currentYear - 6; year <= currentYear; year++) {
                $scope.startSchoolYearOptions.push(year);
            }
        }

        //点击注册时
        $scope.submitOnClick = function () {
            var info = $scope.userInfo;
            var user = new AV.User();
            return user.signUp({
                email: info.email,
                username: info.email,
                password: info.password,

                openId: info.openId,
                nickName: info.nickName,
                avatarUrl: info.avatarUrl,
                sex: info.sex,

                startSchoolYear: info.startSchoolYear,
                school: info.school,
                major: info.major
            }, {
                success: function (user) {
                    alert(JSON.stringify(user));
                },
                error: function (user, error) {
                    alert(error.message);
                }
            });
        };

    })

    .controller('peron_editPersonInfo', function ($scope, WeChatJS$) {
        $scope.WeChatJS$ = WeChatJS$;
    });
