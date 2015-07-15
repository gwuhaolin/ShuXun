/**
 * Created by wuhaolin on 5/20/15.
 * 静态信息
 */
"use strict";

APP.service('InfoService$', function ($rootScope) {
    var that = this;

    this.Major = {
        /**
         * 所有的加载了的专业
         */
        majors: [],
        /**
         * 搜索专业时的关键字
         * @type {string}
         */
        searchMajorKeyword: '',
        loadMore: function () {
            var query = new AV.Query(Model.Major);
            if (that.Major.searchMajorKeyword.length > 0) {
                query.startsWith("name", that.Major.searchMajorKeyword);
            }
            query.skip(that.Major.majors.length);
            query.limit(10);
            query.find().done(function (avosMajors) {
                if (avosMajors.length > 0) {
                    that.Major.majors.pushUniqueArray(avosMajors);
                } else {
                    that.Major.hasMoreFlag = false;
                }
            }).always(function () {
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        hasMoreFlag: true,
        hasMore: function () {
            return that.Major.hasMoreFlag;
        }
    };
    $rootScope.$watch(function () {
        return that.Major.searchMajorKeyword;
    }, function () {
        that.Major.majors.length = 0;
        that.Major.loadMore();
    });
    that.Major.loadMore();

    this.School = {
        /**
         * 所有的加载了的学校
         * @type {Array}
         */
        schools: [],
        loadMore: function () {
            var query = new AV.Query(Model.School);
            var avosGeo = AV.User.current() ? AV.User.current().get('location') : MyLocationByIP;
            if (avosGeo) {//如果有用户的地理位置就按照地理位置排序
                query.near("location", avosGeo);
            }
            if (that.School.searchSchoolKeyword.length > 0) {
                query.startsWith("name", that.School.searchSchoolKeyword);
            }
            query.skip(that.School.schools.length);
            query.limit(10);
            query.find().done(function (avosSchools) {
                if (avosSchools.length > 0) {
                    that.School.schools.pushUniqueArray(avosSchools);
                } else {
                    that.School.hasMoreFlag = false;
                }
            }).always(function () {
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        },
        /**
         * 搜索学校时的关键字
         * @type {string}
         */
        searchSchoolKeyword: '',
        hasMoreFlag: true,
        hasMore: function () {
            return that.School.hasMoreFlag;
        }
    };
    $rootScope.$watch(function () {
        return that.School.searchSchoolKeyword;
    }, function () {
        that.School.schools.length = 0;
        that.School.loadMore();
    });
    that.School.loadMore();

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

    /**
     * 对上传的书的常用描述语
     * @type {string[]}
     */
    this.commonUsedBookDesWords = ['正版', '新书', '送笔记', '可议价', '不议价', '配光盘', '妹子白送'];

});