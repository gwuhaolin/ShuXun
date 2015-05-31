/**
 * Created by wuhaolin on 4/1/15.
 * 自定义全局函数和路由配置
 */
"use strict";
//AVOSCloud
AV.initialize("kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0", "nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm");
if (window.location.host.indexOf('ishuxun.cn') < 0) {//如果网址不是ishuxun.cn就调用部署环境的元函数
    AV.setProduction(false);
}

//微信公共平台
var WECHAT = {
    AppID: 'wx2940a8d3ddcad5e9'
};

var LoadCount = Math.floor(document.body.clientWidth / 80);//每次加载条数,默认加载慢屏幕
var RandomStart = (new Date().getDay()) * Math.floor(Math.random() * 10);//随机产生一个开始数,每次打开看到的专业推荐都不一样

/**
 * 自定义的jsonp调用
 * @param url 目标url
 * @param callback
 * @param onError 当发生错误时调用
 * callback返回json
 */
function jsonp(url, callback, onError) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    var random = Date.now() + String(Math.floor(Math.random() * 100));
    script.src = url + (url.indexOf('?') > 0 ? '&' : '?') + 'callback=CB' + random;
    script.onload = function () {
        script.parentNode.removeChild(script);
    };
    script.onerror = function (error) {
        if (onError) {
            onError(error);
        }
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
        expires = "; expires=" + date.toUTCString();
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

var UserAttrNames = ['openId', 'nickName', 'avatarUrl', 'sex', 'school', 'major', 'startSchoolYear', 'wechatAlert'];
/**
 * 把AVOS User 转换为 json格式的UserInfo
 */
function avosUserToJson(avosUser) {
    if (avosUser == null) {
        return null;
    }
    var json = {};
    for (var i = 0; i < UserAttrNames.length; i++) {
        var attrName = UserAttrNames[i];
        json[attrName] = avosUser.get(attrName);
    }
    json.objectId = avosUser.id;
    json.location = avosUser.get('location');
    return json;
}
/**
 * 把 json格式的UserInfo 转换为 AVOS User
 */
function jsonToAvosUser(jsonUser) {
    var user = new AV.User();
    for (var i = 0; i < UserAttrNames.length; i++) {
        var attrName = UserAttrNames[i];
        if (jsonUser[attrName]) {
            user.set(attrName, jsonUser[attrName]);
        }
    }
    return user;
}
