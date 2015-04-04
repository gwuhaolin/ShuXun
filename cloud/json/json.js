/**
 * Created by wuhaolin on 4/4/15.
 * 静态信息提供
 */
"use strict";

var fs = require('fs');

//所有专业
var Major = JSON.parse(fs.readFileSync('major.json', 'utf-8'));
//所有学校
var School = JSON.parse(fs.readFileSync('school.json', 'utf-8'));

/**
 * 返回名称或者拼音包含关键字的所有结果
 * @param array 需要检索的数值
 * @param keyword 名称关键字或者拼音简写
 */
function searchByKeyword(array, keyword) {
    keyword = keyword.trim();
    var re = [];
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        var pinyinReg = new RegExp(obj['pinyin']);
        if (obj['name'].indexOf(keyword) > -1 || pinyinReg.test(keyword)) {
            re.push(obj);
        }
    }
    return re;
}