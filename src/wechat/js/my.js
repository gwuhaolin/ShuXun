/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";
//AVOSCloud
AV.initialize("kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0", "nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm");

//微信公共平台
var WECHAT = {
    AppID: 'wx2940a8d3ddcad5e9'
};

/**
 * 自定义的jsonp调用
 * @param url 目标url
 * @param callback
 * callback返回json
 */
function jsonp(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    var random = Date.now();
    script.src = url + (url.indexOf('?') > 0 ? '&' : '?') + 'callback=CB' + random;
    script.onload = function () {
        script.parentNode.removeChild(script);
    };
    window['CB' + random] = function (json) {
        callback(json);
    };
    document.head.appendChild(script);
}

function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name, "", -1);
}

/**
 * 使用微信写在cookie里的unionId登入
 * @param unionId 微信ID
 * @returns {*|AV.Promise}
 */
function loginWithUnionId(unionId) {
    if (unionId) {
        return AV.User.logIn(unionId, unionId);
    }
    return AV.Promise.error("unionId错误");
}

/**
 * 调用百度lbs API获得我当前客户端的IP地址对应的经纬度
 * @param callback [经度,纬度]
 */
//function getMyLocationByIP(callback) {
//    var url = 'http://api.map.baidu.com/location/ip?ak=D9748868fb527b49a546fa88932b8cd9&coor=bd09ll';
//    jsonp(url, function (json) {
//        if (json.status == 0) {
//            var point = json.content['point'];
//            callback({
//                longitude: point.x,
//                latitude: point.y
//            });
//        }
//    });
//}
//loginWithUnionId(readCookie('unionId')).done(function (avosUser) {
//    if (avosUser.get('location') == null) {//如果用户没地理位置信息就先通过IP地址获得
//        getMyLocationByIP(function (location) {
//            AV.Cloud.run('updateMyLocation', {
//                latitude: location.latitude,
//                longitude: location.longitude
//            });
//        });
//    }
//});


