/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";

/**
 * 对13位isbn编码求其最后一位校验码
 * @param isbn12
 * @return String 返回校验码
 */
exports.checkCode13 = function (isbn12) {
    var s = 0;
    for (var i = 0; i < 12; i++) {
        var num = parseInt(isbn12.charAt(i));
        if (i % 2 == 0) {
            s += num;
        } else {
            s += num * 3;
        }
    }
    var m = s % 10;
    var n = 10 - m;
    var check = String(n);
    if (n == 10) {
        check = '0';
    }
    return check;
};

/**
 * 校验一个ISBN是否合法
 * @param isbn13
 * @returns {boolean}
 */
exports.isbn13IsLegal = function (isbn13) {
    if (isbn13 && isbn13.length == 13) {
        return exports.checkCode13(isbn13.substr(0, 12)) == isbn13.charAt(12);
    } else {
        return false;
    }
};