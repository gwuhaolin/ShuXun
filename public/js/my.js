/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";

/**
 * 自定义的jsonp调用
 * @param url 目标url
 * @param callback
 * callback返回json
 */
function jsonp(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = url + (url.indexOf('?') > 0 ? '&' : '?') + 'callback=CB&' + Date.now();
    script.onload = function () {
        script.parentNode.removeChild(script);
    };
    window['CB'] = function (json) {
        callback(json);
    };
    document.head.appendChild(script);
}

//AVOSCloud
AV.initialize("kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0", "nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm");

//微信公共平台
var WECHAT = {
    AppID: 'wx2940a8d3ddcad5e9'
};