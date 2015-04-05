/**
 * Created by wuhaolin on 4/4/15.
 * 静态信息提供
 */
"use strict";

var fs = require('fs');

//所有专业
exports.Majors = JSON.parse(fs.readFileSync('cloud/info/major.json', 'utf-8'));
//所有学校
exports.Schools = JSON.parse(fs.readFileSync('cloud/info/school.json', 'utf-8'));

/**
 * 寻找一点附近周围的点
 * @param schools 在这些学校里搜索
 * @param location 中心店
 * @param radius 搜索半径
 * @returns {Array} 半径圆内的学校
 */
exports.searchSchoolByLocation = function (schools, location, radius) {
    if (location == null || location == undefined) {
        return schools;
    }
    var re = [];
    for (var i = 0; i < schools.length; i++) {
        var oneSchool = schools[i];
        var lat = oneSchool.location['lat'];
        var lng = oneSchool.location['lng'];
        if (Math.abs(location['lat'] - lat) < radius && Math.abs(location['lng'] - lng) < radius) {
            re.push(oneSchool);
        }
    }
    if (oneSchool.length > 0) {
        return re;
    } else {
        return exports.searchSchoolByLocation(schools, location, radius * 2);
    }
};

/**
 * 返回名称或者拼音包含关键字的所有结果
 * @param schools 在这些学校里搜索
 * @param keyword 名称关键字或者拼音简写
 */
exports.searchSchoolByKeyword = function (schools, keyword) {
    keyword = keyword.trim();
    var re = [];
    for (var i = 0; i < schools.length; i++) {
        var obj = schools[i];
        if (obj['name'].indexOf(keyword) > -1) {
            re.push(obj);
        }
    }
    return re;
};

/**
 * 返回名称或者拼音包含关键字的所有结果
 * @param keyword 名称关键字或者拼音简写
 * @param location 中心点位置
 */
exports.searchSchoolByKeywordAndLocation = function (keyword, location) {
    var re = exports.searchSchoolByKeyword(keyword);
    if (re.length == 0) {
        return exports.searchSchoolByLocation(exports.Schools, location, 1);
    } else {
        return exports.searchSchoolByLocation(re, location, 1);
    }
};