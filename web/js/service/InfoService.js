/**
 * Created by wuhaolin on 5/20/15.
 * 静态信息
 */
"use strict";

APP.service('InfoService$', function ($rootScope) {
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
            var avosGeo = AV.User.current() ? AV.User.current().get('location') : null;
            var query = new AV.Query(Model.School);
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

    /**
     * 对上传的书的常用描述语
     * @type {string[]}
     */
    this.commonUsedBookDesWords = ['正版', '新书', '送笔记', '可议价', '不议价', '配光盘', '妹子白送'];

});